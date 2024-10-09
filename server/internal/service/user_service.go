package service

import (
	"backend/internal/database"
	"backend/internal/repository"
	"backend/pkg/response"
	"golang.org/x/crypto/bcrypt"
	"time"
)

type IUserService interface {
	Login(email string, password string) (int, map[string]interface{})
	UpdateUserStatus(email string, status string) int
	CreateNewUser(email string, password string, confirmed string) int
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

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
