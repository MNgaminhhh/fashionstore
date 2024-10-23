package service

import (
	"backend/internal/database"
	"backend/internal/repository"
	"backend/pkg/response"
	"fmt"
	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
	"log"
	"os"
	"time"
)

type IUserService interface {
	Login(email string, password string) (int, map[string]interface{})
	UpdateUserStatus(email string, status string) int
	CreateNewUser(email string, password string, confirmed string) int
	SendEmailResetPassword(email string) int
	ValidateToken(token string, secret string) (int, string)
	ResetPassword(email string, newPassword string, confirmPassword string) int
	SendEmailVerify(email string) int
}

type userService struct {
	userRepo repository.IUserRepository
	auth     Auth
}

func NewUserService(
	userRepo repository.IUserRepository,
) IUserService {
	return &userService{
		userRepo: userRepo,
		auth: Auth{
			Issuer:       "mtshop.com",
			Audience:     "",
			Secret:       os.Getenv("ACCESS_SECRET"),
			TokenExpiry:  time.Hour * 24 * 7,
			CookieDomain: "localhost",
			CookiePath:   "/",
			CookieName:   "access_cookie",
		},
	}
}

func (us *userService) Login(email string, password string) (int, map[string]interface{}) {
	user, err := us.userRepo.GetUserByEmail(email)
	if err != nil {
		return response.ErrCodeEmailNotFound, nil
	}
	if !CheckPasswordHash(password, user.Password) {
		return response.ErrCodeIncorrectPassword, nil
	}
	if user.Status == database.UserStatusInactive {
		return response.ErrCodeUserInactive, nil
	}
	if user.Status == database.UserStatusLock {
		return response.ErrCodeUserLocked, nil
	}

	tokens, err := us.auth.GenerateToken(user)

	if err != nil {
		return response.ErrCodeInternal, nil
	}

	cookie := us.auth.getCookie(tokens)

	data := map[string]interface{}{
		"access_token": tokens,
		"cookie":       cookie,
	}

	return response.SuccessCode, data
}

func (us *userService) UpdateUserStatus(email string, status string) int {
	_, err := us.userRepo.UpdateStatus(email, status)
	if err != nil {
		return response.ErrCodeEmailNotFound
	}
	return response.SuccessCode
}

func (us *userService) CreateNewUser(email string, password string, confirmed string) int {
	user, _ := us.userRepo.GetUserByEmail(email)
	if user != nil {
		return response.ErrCodeEmailAlreadyUsed
	}
	if password != confirmed {
		return response.ErrCodeIncorrectConfirmedPassword
	}
	passwordHash, _ := HashPassword(password)
	_, err := us.userRepo.CreateNewUser(email, passwordHash)
	if err != nil {
		return response.ErrCodeInternal
	}
	result := make(chan int)
	go func() {
		result <- us.SendEmailVerify(email)
	}()

	sendEmailResult := <-result
	if sendEmailResult != response.SuccessCode {
		return sendEmailResult
	}

	return response.SuccessCode
}

func (us *userService) ValidateToken(token string, secret string) (int, string) {
	claims := jwt.MapClaims{}
	log.Println(token)
	tkn, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(secret), nil
	})

	if err != nil {
		log.Println("Error parsing token:", err)
		return response.ErrCodeTokenInvalid, ""
	}

	if tkn.Valid {
		if email, ok := claims["email"].(string); ok {
			log.Println("Valid email:", email)
			return response.SuccessCode, email
		} else {
			log.Println("Email field not found in token")
			return response.ErrCodeTokenInvalid, ""
		}
	}
	return response.ErrCodeTokenInvalid, ""
}

func (us *userService) ResetPassword(email string, newPassword string, confirmPassword string) int {
	if newPassword != confirmPassword {
		return response.ErrCodeIncorrectConfirmedPassword
	}

	hash, err := HashPassword(newPassword)
	if err != nil {
		return response.ErrCodeInternal
	}
	_, errResetPass := us.userRepo.UpdatePassword(email, hash)
	if errResetPass != nil {
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (us *userService) SendEmailWithToken(email, purpose, linkPath, subject string, tokenExpiry time.Duration, secret string) int {
	auth := Auth{
		Issuer:       "mtshop.com",
		Audience:     "",
		Secret:       secret,
		TokenExpiry:  tokenExpiry,
		CookieDomain: "localhost",
		CookiePath:   linkPath,
		CookieName:   fmt.Sprintf("%s-token", purpose),
	}

	token, err := auth.GenerateTokenByEmail(email)
	if err != nil {
		return response.ErrCodeInternal
	}

	emailService := NewEmailService(SMTPServer{
		Host:     "sandbox.smtp.mailtrap.io",
		Port:     2525,
		Username: "75450a29e28cd1",
		Password: "4835aafc0d3d8e",
	})

	link := fmt.Sprintf("http://localhost:8080%s?token=%s", linkPath, token)
	content := fmt.Sprintf(`
	<html>
		<body>
			<p>Nhấn vào liên kết sau để %s: <a href="%s">%s</a></p>
			<b>Liên kết sẽ hết hạn trong %v phút.</b>
		</body>
	</html>
	`, purpose, link, subject, tokenExpiry.Minutes())

	smtpErr := emailService.SendEmail(subject, content, email)
	if smtpErr != nil {
		log.Fatal("Error sending email:", smtpErr)
		return response.ErrCodeInternal
	}

	return response.SuccessCode
}

func (us *userService) SendEmailResetPassword(email string) int {
	return us.SendEmailWithToken(email, "Đặt lại mật khẩu", "/api/v1/auth/reset-password", "MTShop Reset Password", time.Minute*5, os.Getenv("RESET_PASSWORD_SECRET"))
}

func (us *userService) SendEmailVerify(email string) int {
	return us.SendEmailWithToken(email, "kích hoạt tài khoản", "/api/v1/auth/verify-email", "MTShop Verify Email", time.Minute*5, os.Getenv("ACTIVE_SECRET"))
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
