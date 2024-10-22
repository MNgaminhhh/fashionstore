package controller

import (
	"backend/internal/enum"
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
	if err := c.Validate(params); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}

	code, data := uc.userService.Login(params.Email, params.Password, c.Response().Writer)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "Login failed")
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

func (uc *UserController) SendEmailResetPassword(c echo.Context) error {
	var params validator.SendEmailRequest
	if err := c.Bind(&params); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, err.Error())
	}
	if err := c.Validate(params); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}
	code := uc.userService.SendEmailResetPassword(params.Email)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "Send email reset password failed")
	}
	return response.SuccessResponse(c, response.SuccessCode, "Send email reset password successful")
}

func (uc *UserController) ForgetPassword(c echo.Context) error {
	token := c.QueryParams().Get("token")
	if token == "" {
		return response.ErrorResponse(c, response.ErrCodeTokenInvalid, "token is empty")
	}

	code, email := uc.userService.ValidateToken(token, service.ResetSecret)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "invalid token")
	}

	requestParams := validator.ForgetPasswordRequest{}
	if err := c.Bind(&requestParams); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, err.Error())
	}
	if err := c.Validate(requestParams); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}
	code = uc.userService.ResetPassword(email, requestParams.NewPassword, requestParams.ConfirmPassword)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "Reset password failed")
	}
	return response.SuccessResponse(c, response.SuccessCode, "Reset password successful")
}

func (uc *UserController) SendEmailActiveUser(c echo.Context) error {
	var params validator.SendEmailRequest
	if err := c.Bind(&params); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, err.Error())
	}
	if err := c.Validate(params); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}
	code := uc.userService.SendEmailVerify(params.Email)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "Send email active user failed")
	}
	return response.SuccessResponse(c, response.SuccessCode, "Đã gửi email kích hoạt tài khoản. Vui lòng kiểm tra email!!")
}

func (uc *UserController) ActiveUser(c echo.Context) error {
	token := c.QueryParam("token")
	if token == "" {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "token is empty")
	}
	code, email := uc.userService.ValidateToken(token, service.ActiveSecret)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "invalid token")
	}
	updateStatusCode := uc.userService.UpdateUserStatus(email, enum.ACTIVE.String())
	if updateStatusCode != response.SuccessCode {
		return response.ErrorResponse(c, updateStatusCode, "Update user status failed")
	}
	return response.SuccessResponse(c, response.SuccessCode, "Update user status successful")
}
