package service

import (
	"backend/internal/repository"
	"backend/pkg/response"
)

type IUserService interface {
	Login(email string, password string) int
	UpdateUserStatus(email string, status string) int
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

func (us *userService) Login(email string, password string) int {
	user, err := us.userRepo.GetUserByEmail(email)
	if err != nil {
		return response.ErrCodeEmailNotFound
	}
	if user.Password != password {
		return response.ErrCodePassword
	}
	return response.SuccessCode
}

func (us *userService) UpdateUserStatus(email string, status string) int {
	_, err := us.userRepo.UpdateStatus(email, status)
	if err != nil {
		return response.ErrCodeEmailNotFound
	}
	return response.SuccessCode
}
