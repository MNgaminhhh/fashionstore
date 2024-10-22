package service

import (
	"backend/internal/repository"
	"backend/pkg/response"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
)

const Secret = "super-secret"
const ResetSecret = "reset-password"
const ActiveSecret = "active-user"

type IUserService interface {
	Login(email string, password string, w http.ResponseWriter) (int, map[string]interface{})
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
			Issuer:        "mtshop.com",
			Audience:      "",
			TokenExpiry:   time.Minute * 15,
			RefreshExpiry: time.Hour * 24,
			CookieDomain:  "localhost",
			CookiePath:    "/",
			CookieName:    "refresh-token",
		},
	}
}

func (us *userService) Login(email string, password string, w http.ResponseWriter) (int, map[string]interface{}) {
	user, err := us.userRepo.GetUserByEmail(email)
	if err != nil {
		return response.ErrCodeEmailNotFound, nil
	}
	if !CheckPasswordHash(password, user.Password) {
		return response.ErrCodeIncorrectPassword, nil
	}

	tokens, err := us.auth.GenerateToken(user)
	if err != nil {
		return response.ErrCodeInternal, nil
	}
	refreshCookie := us.auth.GetRefreshCookie(tokens.RefreshToken)
	http.SetCookie(w, refreshCookie)

	data := map[string]interface{}{
		"access_token": tokens.Token,
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

	emailService := NewEmailService()

	link := fmt.Sprintf("http://localhost:3000%s?token=%s", linkPath, token)
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
		return response.ErrCodeCannotVerifyThisEmail
	}

	return response.SuccessCode
}

func (us *userService) SendEmailResetPassword(email string) int {
	return us.SendEmailWithToken(email, "Đặt lại mật khẩu", "/reset-password", "MTShop Reset Password", time.Minute*5, ResetSecret)
}

func (us *userService) SendEmailVerify(email string) int {
	return us.SendEmailWithToken(email, "kích hoạt tài khoản", "/verify-account", "[MTShop] Xác thực tài khoản", time.Minute*5, ActiveSecret)
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
