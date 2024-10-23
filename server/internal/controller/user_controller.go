package controller

import (
	"backend/internal/enum"
	"backend/internal/service"
	"backend/internal/validator"
	"backend/pkg/response"
	"database/sql"
	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"github.com/labstack/echo"
	"log"
	"net/http"
	"os"
	"strings"
	"time"
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

	cookie := data["cookie"]
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

	code, claims := uc.userService.ValidateToken(token, os.Getenv("RESET_PASSWORD_SECRET"))
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "invalid token")
	}
	email, ok := claims["email"].(string)
	if !ok {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "invalid token")
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
		return response.ErrorResponse(c, response.ErrCodeTokenInvalid, "token is empty")
	}
	code, claims := uc.userService.ValidateToken(token, os.Getenv("ACTIVE_SECRET"))
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "invalid token")
	}
	email, ok := claims["email"].(string)
	if !ok {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "invalid token")
	}
	updateStatusCode := uc.userService.UpdateUserStatus(email, enum.ACTIVE.String())
	if updateStatusCode != response.SuccessCode {
		return response.ErrorResponse(c, updateStatusCode, "Update user status failed")
	}
	return response.SuccessResponse(c, response.SuccessCode, "Update user status successful")
}

func (uc *UserController) ResendEmailActive(c echo.Context) error {
	var params validator.SendEmailRequest
	if err := c.Bind(&params); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, err.Error())
	}
	if err := c.Validate(params); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}
	code := uc.userService.SendEmailVerify(params.Email)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "Gửi email xác thực thất bại!")
	}
	return response.SuccessResponse(c, response.SuccessCode, "Đã gửi lai email kích hoạt!")
}

func (uc *UserController) GetUserInformation(c echo.Context) error {
	valid, claims := uc.CheckAuthorization(c)
	if valid != response.SuccessCode {
		return response.ErrorResponse(c, valid, "Invalid token")
	}
	log.Println("claims")
	id, ok := claims["sub"].(string)
	if !ok {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "invalid token")
	}
	userId, _ := uuid.Parse(id)
	code, user := uc.userService.GetUserInformation(userId)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "Get user info failed")
	}
	data := map[string]interface{}{
		"id":        user.ID,
		"email":     user.Email,
		"full_name": user.FullName.String,
		"dob":       user.Dob.Time,
	}
	return response.SuccessResponse(c, response.SuccessCode, data)
}

func (uc *UserController) UpdateUser(c echo.Context) error {
	valid, claims := uc.CheckAuthorization(c)
	if valid != response.SuccessCode {
		return response.ErrorResponse(c, valid, "Invalid token")
	}
	id := claims["sub"].(string)
	userId, _ := uuid.Parse(id)
	code, user := uc.userService.GetUserInformation(userId)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "Get user info failed")
	}
	var params validator.UpdateUserRequest
	if err := c.Bind(&params); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, err.Error())
	}
	if err := c.Validate(params); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}
	if params.PhoneNumber != "" {
		user.PhoneNumber = sql.NullString{
			String: params.PhoneNumber,
			Valid:  true,
		}
	}
	if params.FullName != "" {
		user.FullName = sql.NullString{
			String: params.FullName,
			Valid:  true,
		}
	}
	if params.Dob != "" {
		user.Dob = sql.NullTime{
			Time:  time.Now(),
			Valid: true,
		}
	}
	code = uc.userService.UpdateUserInformation(user)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "Update user info failed")
	}
	return response.SuccessResponse(c, response.SuccessCode, "Update user info successful")
}

func (uc *UserController) CheckAuthorization(c echo.Context) (int, jwt.MapClaims) {
	authHeader := c.Request().Header.Get("Authorization")
	if authHeader == "" {
		return response.ErrCodeUnauthorized, nil
	}
	if strings.HasPrefix(authHeader, "Bearer ") {
		token := strings.TrimPrefix(authHeader, "Bearer ")
		code, claims := uc.userService.ValidateToken(token, os.Getenv("ACCESS_SECRET"))
		if code != response.SuccessCode {
			return response.ErrCodeUnauthorized, nil
		}
		return response.SuccessCode, claims
	}
	return response.ErrCodeUnauthorized, nil
}
