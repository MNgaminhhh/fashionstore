package response

import (
	"errors"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo"
	"net/http"
)

type ResponseData struct {
	Code    int         `json:"code"`
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}
type ValidationErrorResponse struct {
	Code    int               `json:"code"`
	Success bool              `json:"success"`
	Message string            `json:"message"`
	Errors  map[string]string `json:"errors"`
}

func SuccessResponse(c echo.Context, code int, data interface{}) error {
	return c.JSON(http.StatusOK, ResponseData{
		Code:    code,
		Message: msg[code],
		Success: true,
		Data:    data,
	})
}

func ErrorResponse(c echo.Context, code int, message string) error {
	return c.JSON(http.StatusOK, ResponseData{
		Code:    code,
		Message: msg[code],
		Success: false,
		Data:    nil,
	})
}
func ValidationResponse(c echo.Context, code int, err error) error {
	errorMessages := parseValidation(err)

	return c.JSON(http.StatusBadRequest, ValidationErrorResponse{
		Code:    http.StatusBadRequest,
		Success: false,
		Message: msg[code],
		Errors:  errorMessages,
	})
}

func Msg(code int) string {
	if message, ok := msg[code]; ok {
		return message
	}
	return "Lỗi !!!"
}

func parseValidation(err error) map[string]string {
	errorMessages := make(map[string]string)

	var errs validator.ValidationErrors
	if errors.As(err, &errs) {
		for _, e := range errs {
			switch e.Tag() {
			case "required":
				errorMessages[e.Field()] = e.Field() + " không được bỏ trống"
			case "email":
				errorMessages[e.Field()] = "Email không hợp lệ"
			case "min":
				errorMessages[e.Field()] = e.Field() + " phải có ít nhất " + e.Param() + " ký tự"
			case "max":
				errorMessages[e.Field()] = e.Field() + " không được vượt quá " + e.Param() + " ký tự"
			default:
				errorMessages[e.Field()] = "Giá trị không hợp lệ"
			}
		}
	}

	return errorMessages
}
