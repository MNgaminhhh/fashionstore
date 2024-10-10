package service

import (
	"backend/internal/database"
	"backend/internal/repository"
	"backend/pkg/response"
	"fmt"
	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
	"log"
	"net/smtp"
	"time"
)

const ResetSecret = "reset-password"

type IUserService interface {
	Login(email string, password string) (int, map[string]interface{})
	UpdateUserStatus(email string, status string) int
	CreateNewUser(email string, password string, confirmed string) int
	SendEmailResetPassword(email string) int
	ValidateResetPasswordToken(token string) (int, string)
	ResetPassword(email string, newPassword string, confirmPassword string) int
}

type userService struct {
	userRepo repository.IUserRepository
}

func NewUserService(
	userRepo repository.IUserRepository,
) IUserService {
	return &userService{
		userRepo: userRepo,
	}
}

func (us *userService) Login(email string, password string) (int, map[string]interface{}) {
	auth := Auth{
		Issuer:        "mtshop.com",
		Audience:      "",
		Secret:        "super-secret",
		TokenExpiry:   time.Minute * 15,
		RefreshExpiry: time.Hour * 24,
		CookieDomain:  "localhost",
		CookiePath:    "/",
		CookieName:    "refresh-token",
	}

	user, err := us.userRepo.GetUserByEmail(email)
	if err != nil {
		return response.ErrCodeEmailNotFound, nil
	}
	if !CheckPasswordHash(password, user.Password) {
		return response.ErrCodePassword, nil
	}
	if user.Status == database.UserStatusInactive {
		return response.ErrCodeUserInactive, nil
	}
	if user.Status == database.UserStatusLock {
		return response.ErrCodeUserLocked, nil
	}

	tokens, err := auth.GenerateToken(user)

	if err != nil {
		return response.ErrCodeInternal, nil
	}

	cookie := auth.GetRefreshCookie(tokens.RefreshToken)

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
		TokenExpiry:  time.Minute * 15,
		CookieDomain: "localhost",
		CookiePath:   "/api/v1/reset-password",
		CookieName:   "reset-token",
	}

	resetToken, err := resetAuth.GenerateResetPasswordToken(email)
	if err != nil {
		return response.ErrCodeInternal
	}

	resetLink := fmt.Sprintf("localhost:8080/reset-password?token=%s", resetToken)

	auth := smtp.PlainAuth("", "taihk2@gmail.com", "whyw mxby ezkq cqdh", "smtp.gmail.com")
	to := []string{email}
	msg := []byte("Subject: Reset Password\n" +
		"Content-Type: text/html; charset=UTF-8\n\n" +
		"Click the link to reset your password: " + resetLink)

	smtpErr := smtp.SendMail("smtp.gmail.com:587", auth, email, to, msg)
	if smtpErr != nil {
		log.Fatal(smtpErr)
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

func (us *userService) ValidateResetPasswordToken(token string) (int, string) {
	claims := jwt.MapClaims{}
	log.Println(token)
	tkn, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(ResetSecret), nil
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
