package repository

import (
	"backend/global"
	"backend/internal/database"
	"fmt"
	"strings"
)

type IUserRepository interface {
	GetUserByEmail(email string) (*database.User, error)
	UpdateStatus(email string, status string) (error, error)
	CreateNewUser(email string, password string) (error, error)
}

type userRepository struct {
	sqlc *database.Queries
}

func (ur *userRepository) GetUserByEmail(email string) (*database.User, error) {
	user, err := ur.sqlc.GetUserByEmail(ctx, email)
	if err != nil {
		fmt.Printf("GetUserByEmail error: %v\n", err)
		return nil, err
	}
	return &user, nil
}

func (ur *userRepository) UpdateStatus(email string, userStatus string) (error, error) {
	status := database.UserStatus(strings.ToLower(userStatus))
	params := database.UpdateUserStatusParams{
		Status: status,
		Email:  email,
	}
	updatedUser, err := ur.sqlc.UpdateUserStatus(ctx, params)
	if err != nil {
		return nil, err
	}
	return updatedUser, nil
}

func (ur *userRepository) CreateNewUser(email string, password string) (error, error) {
	params := database.CreateNewUserParams{
		Email:    email,
		Password: password,
	}
	createdUser, err := ur.sqlc.CreateNewUser(ctx, params)
	if err != nil {
		return nil, err
	}
	return createdUser, nil
}

func NewUserRepository() IUserRepository {
	return &userRepository{
		sqlc: database.New(global.Mdb),
	}
}
