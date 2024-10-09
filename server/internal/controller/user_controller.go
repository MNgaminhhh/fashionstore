package controller

import (
	"backend/internal/service"
	"backend/internal/validator"
	"backend/pkg/response"
	"github.com/labstack/echo"
)

type UserController struct {
	userService service.IUserService
}

func NewUserController(
	userService service.IUserService,
) *UserController {
	return &UserController{
		userService: userService,
	}
}

func (uc *UserController) Login(c echo.Context) error {
	var params validator.UserLoginRequest
	if err := c.Bind(&params); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, err.Error())
	}

	code := uc.userService.Login(params.Email, params.Password)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "Login failed")
	}

	return response.SuccessResponse(c, response.SuccessCode, "Login successful")
}
