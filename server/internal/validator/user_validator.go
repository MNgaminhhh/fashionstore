package validator

import "time"

type UserLoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=5,max=32"`
}

type UpdateUserStatusRequest struct {
	Email  string `json:"email" validate:"required,email"`
	Status string `json:"status" validate:"required,oneof=active inactive lock"`
}

type CreateNewUserRequest struct {
	Email           string `json:"email" validate:"required,email"`
	Password        string `json:"password" validate:"required,min=8,max=32"`
	ConfirmPassword string `json:"confirm_password" validate:"required,min=8,max=32"`
}

type SendEmailRequest struct {
	Email string `json:"email" validate:"required,email"`
}

type ForgetPasswordRequest struct {
	NewPassword     string `json:"new_password" validate:"required,min=5,max=32"`
	ConfirmPassword string `json:"confirm_password" validate:"required,min=5,max=32"`
}

type UpdateUserRequest struct {
	FullName    *string `json:"full_name"`
	PhoneNumber *string `json:"phone_number"`
	Dob         *string `json:"dob"`
	Avt         *string `json:"avt"`
}

type FilterUserRequest struct {
	FullName    *string    `json:"full_name"`
	PhoneNumber *string    `json:"phone_number"`
	Dob         *time.Time `json:"dob"`
	Email       *string    `json:"email"`
	Status      *string    `json:"status"`
	Limit       *int       `json:"limit"`
	Page        *int       `json:"page"`
}
