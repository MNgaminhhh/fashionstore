package repository

import (
	"backend/global"
	"backend/internal/database"
	"fmt"
	"github.com/google/uuid"
	"strings"
)

type IUserRepository interface {
	GetUserByEmail(email string) (*database.User, error)
	UpdateStatus(email string, status string) error
	CreateNewUser(email string, password string) error
	UpdatePassword(email, newPassword string) error
	FindByID(uuid uuid.UUID) (*database.User, error)
	UpdateUser(newUser *database.User) error
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

func (ur *userRepository) UpdateStatus(email string, userStatus string) error {
	status := database.UserStatus(strings.ToLower(userStatus))
	params := database.UpdateUserStatusParams{
		Status: status,
		Email:  email,
	}
	err := ur.sqlc.UpdateUserStatus(ctx, params)
	return err
}

func (ur *userRepository) CreateNewUser(email string, password string) error {
	params := database.CreateNewUserParams{
		Email:    email,
		Password: password,
	}
	err := ur.sqlc.CreateNewUser(ctx, params)
	return err
}

func (ur *userRepository) UpdatePassword(email, newPassword string) error {
	params := database.UpdateNewPasswordParams{
		Email:    email,
		Password: newPassword,
	}
	err := ur.sqlc.UpdateNewPassword(ctx, params)
	if err != nil {
		return err
	}
	return nil
}

func (ur *userRepository) FindByID(uuid uuid.UUID) (*database.User, error) {
	user, err := ur.sqlc.GetUserById(ctx, uuid)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (ur *userRepository) UpdateUser(newUser *database.User) error {
	params := database.UpdateUserParams{
		FullName:    newUser.FullName,
		PhoneNumber: newUser.PhoneNumber,
		Dob:         newUser.Dob,
		ID:          newUser.ID,
	}
	err := ur.sqlc.UpdateUser(ctx, params)
	return err
}

func NewUserRepository() IUserRepository {
	return &userRepository{
		sqlc: database.New(global.Mdb),
	}
}
