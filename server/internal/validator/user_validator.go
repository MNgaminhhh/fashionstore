package validator

type UserLoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8,max=32"`
}

type UpdateStatusParam struct {
	Email  string `json:"email" binding:"required,email"`
	Status string `json:"status" binding:"required,oneof=active inactive"`
}
