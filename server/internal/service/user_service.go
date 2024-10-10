package service

import (
	"backend/internal/database"
	"backend/internal/repository"
	"backend/pkg/response"
	"fmt"
	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
	"log"
	"net/http"
	"time"
)

const Secret = "super-secret"
const ResetSecret = "reset-password"
const ActiveSecret = "active-user"

type IUserService interface {
	Login(email string, password string) (int, map[string]interface{})
	UpdateUserStatus(email string, status string) int
	CreateNewUser(email string, password string, confirmed string) int
	SendEmailResetPassword(email string) int
	ValidateToken(token string, secret string) (int, string)
	ResetPassword(email string, newPassword string, confirmPassword string) int
	SendEmailActiveUser(email string) int
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
			Issuer:        "mtshop.com",
			Audience:      "",
			Secret:        Secret,
			TokenExpiry:   time.Minute * 15,
			RefreshExpiry: time.Hour * 24,
			CookieDomain:  "localhost",
			CookiePath:    "/",
			CookieName:    "refresh-token",
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

	cookie := us.auth.GetRefreshCookie(tokens.RefreshToken)

	data := map[string]interface{}{
		"access_token":   tokens.Token,
		"refresh_cookie": cookie,
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
		result <- us.SendEmailActiveUser(email)
	}()

	sendEmailResult := <-result
	if sendEmailResult != response.SuccessCode {
		return sendEmailResult
	}

	return response.SuccessCode
}

func (us *userService) SendEmailResetPassword(email string) int {
	user, _ := us.userRepo.GetUserByEmail(email)
	if user == nil {
		return response.ErrCodeEmailNotFound
	}

	resetAuth := Auth{
		Issuer:       "mtshop.com",
		Audience:     "",
		Secret:       ResetSecret,
		TokenExpiry:  time.Minute * 5,
		CookieDomain: "localhost",
		CookiePath:   "/api/v1/auth/reset-password",
		CookieName:   "reset-token",
	}

	resetToken, err := resetAuth.GenerateTokenByEmail(email)
	if err != nil {
		return response.ErrCodeInternal
	}

	emailService := NewEmailService(SMTPServer{
		Host:     "smtp.gmail.com",
		Port:     587,
		Username: "taihk2@gmail.com",
		Password: "whyw mxby ezkq cqdh",
	})
	resetLink := fmt.Sprintf("http://localhost:8080/auth/reset-password?token=%s", resetToken)
	content := fmt.Sprintf(`
	<html>
		<body>
			<p>Nhấn vào liên kết sau để đặt lại mật khẩu: <a href="%s">Reset password</a></p>
			<b>Liên kết sẽ hết hạn trong 5 phút.</b>
		</body>
	</html>
	`, resetLink)

	smtpErr := emailService.SendEmail("MTShop Reset Password", content, email)
	if smtpErr != nil {
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
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

func (us *userService) RefreshToken(cookies []*http.Cookie) (int, map[string]interface{}) {
	for _, cookie := range cookies {
		if cookie.Name == us.auth.CookieName {
			claims := jwt.MapClaims{}
			refreshToken := cookie.Value

			_, err := jwt.ParseWithClaims(refreshToken, claims, func(token *jwt.Token) (interface{}, error) {
				return []byte(us.auth.Secret), nil
			})
			if err != nil {
				return response.ErrCodeTokenInvalid, nil
			}

			email, ok := claims["email"].(string)
			if !ok {
				return response.ErrCodeTokenInvalid, nil
			}

			user, err := us.userRepo.GetUserByEmail(email)
			if err != nil {
				return response.ErrCodeEmailNotFound, nil
			}

			tokensPairs, err := us.auth.GenerateToken(user)
			if err != nil {
				return response.ErrCodeInternal, nil
			}

			data := map[string]interface{}{
				"access_token":   tokensPairs.Token,
				"refresh_cookie": us.auth.GetRefreshCookie(tokensPairs.RefreshToken),
			}
			return response.SuccessCode, data
		}
	}
	return response.ErrCodeUnauthorized, nil
}

func (us *userService) SendEmailActiveUser(email string) int {
	activeAuth := Auth{
		Issuer:        "mtshop.com",
		Audience:      "",
		Secret:        ActiveSecret,
		TokenExpiry:   time.Minute * 5,
		RefreshExpiry: 0,
		CookieDomain:  "localhost",
		CookiePath:    "/api/v1/auth/verify-email",
		CookieName:    "verify-email-cookie",
	}

	token, err := activeAuth.GenerateTokenByEmail(email)
	if err != nil {
		return response.ErrCodeInternal
	}
	emailService := NewEmailService(SMTPServer{
		Host:     "smtp.gmail.com",
		Port:     587,
		Username: "taihk2@gmail.com",
		Password: "whyw mxby ezkq cqdh",
	})
	activeLink := fmt.Sprintf("http://localhost:8080/api/v1/auth/verify-email?token=%s", token)
	content := fmt.Sprintf(`
	<html>
		<body>
			<p>Nhấn vào liên kết sau để kích hoạt tài khoản: <a href="%s">Verify Email</a></p>
			<b>Liên kết sẽ hết hạn trong 5 phút.</b>
		</body>
	</html>
	`, activeLink)
	smtpErr := emailService.SendEmail("MTShop Verify Email", content, email)
	if smtpErr != nil {
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}
