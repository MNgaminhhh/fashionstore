package repository

import (
	"backend/global"
	"backend/internal/database"
	"backend/internal/validator"
	"database/sql"
	"fmt"
	"github.com/google/uuid"
	"log"
	"strings"
)

type IUserRepository interface {
	GetUserByEmail(email string) (*database.User, error)
	UpdateStatus(email string, status string) error
	CreateNewUser(email string, password string) error
	UpdatePassword(email, newPassword string) error
	FindByID(uuid uuid.UUID) (*database.User, error)
	UpdateUser(newUser *database.User) error
	GetAllUser(customParam validator.FilterUserRequest) ([]database.User, error)
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
		Status: database.NullUserStatus{
			UserStatus: status,
			Valid:      true,
		},
		Email: email,
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
		Avt:         newUser.Avt,
		ID:          newUser.ID,
	}
	err := ur.sqlc.UpdateUser(ctx, params)
	return err
}

func (ur *userRepository) GetAllUser(customParam validator.FilterUserRequest) ([]database.User, error) {
	param := database.GetAllUserParams{
		Column1: sql.NullString{
			Valid: customParam.FullName != nil,
		},
		Dob: sql.NullTime{
			Valid: customParam.Dob != nil,
		},
		Column3: sql.NullString{
			Valid: customParam.Email != nil,
		},
		Status: database.NullUserStatus{
			UserStatus: "",
			Valid:      false,
		},
		Column5: sql.NullString{
			Valid: customParam.PhoneNumber != nil,
		},
	}
	if customParam.FullName != nil {
		param.Column1 = sql.NullString{
			Valid:  true,
			String: *customParam.FullName,
		}
	}
	if customParam.Dob != nil {
		param.Dob = sql.NullTime{
			Valid: true,
			Time:  *customParam.Dob,
		}
	}
	if customParam.Email != nil {
		param.Column3 = sql.NullString{
			Valid:  true,
			String: *customParam.Email,
		}
	}
	if customParam.Status != nil {
		status := database.UserStatus(*customParam.Status)
		param.Status.UserStatus = status
		param.Status.Valid = true
	}
	if customParam.PhoneNumber != nil {
		param.Column5 = sql.NullString{
			Valid:  true,
			String: *customParam.PhoneNumber,
		}
	}
	log.Println(param)
	users, err := ur.sqlc.GetAllUser(ctx, param)
	if err != nil {
		return nil, err
	}
	return users, nil
}

func NewUserRepository() IUserRepository {
	return &userRepository{
		sqlc: database.New(global.Mdb),
	}
}
