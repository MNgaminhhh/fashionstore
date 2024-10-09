package validator

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
	Password        string `json:"password" validate:"required,min=5,max=32"`
	ConfirmPassword string `json:"confirm_password" validate:"required,min=5,max=32"`
}
