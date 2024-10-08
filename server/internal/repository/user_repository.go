package repository

import (
	"backend/global"
	"backend/internal/database"
	"fmt"
)

type IUserRepository interface {
	GetUserByEmail(email string) (*database.User, error)
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

func NewUserRepository() IUserRepository {
	return &userRepository{
		sqlc: database.New(global.Mdb),
	}
}
