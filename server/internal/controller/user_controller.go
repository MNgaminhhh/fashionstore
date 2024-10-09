package controller

import (
	"backend/internal/service"
	"backend/internal/validator"
	"backend/pkg/response"
	"github.com/labstack/echo"
	"net/http"
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
	if err := c.Validate(params); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}
	code, data := uc.userService.Login(params.Email, params.Password)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "Login failed")
	}

	cookie := data["refresh_cookie"]
	refreshCookie, ok := cookie.(*http.Cookie)
	if ok {
		c.SetCookie(refreshCookie)
	}

	return response.SuccessResponse(c, response.SuccessCode, data)
}

func (uc *UserController) UpdateUserStatus(c echo.Context) error {
	var params validator.UpdateUserStatusRequest
	if err := c.Bind(&params); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, err.Error())
	}
	if err := c.Validate(params); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}

	code := uc.userService.UpdateUserStatus(params.Email, params.Status)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "Update user status failed")
	}

	return response.SuccessResponse(c, response.SuccessCode, "Update user status successful")
}

func (uc *UserController) CreateNewUser(c echo.Context) error {
	var params validator.CreateNewUserRequest
	if err := c.Bind(&params); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, err.Error())
	}
	if err := c.Validate(params); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}
	code := uc.userService.CreateNewUser(params.Email, params.Password, params.ConfirmPassword)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "Create new user failed")
	}

	return response.SuccessResponse(c, response.SuccessCode, "Create new user successful")
}
