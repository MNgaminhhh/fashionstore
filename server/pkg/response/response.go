package response

import (
	"errors"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo"
	"net/http"
	"strings"
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
	return "Có lỗi xảy ra!"
}

func parseValidation(err error) map[string]string {
	errorMessages := make(map[string]string)

	var errs validator.ValidationErrors
	if errors.As(err, &errs) {
		for _, e := range errs {
			fieldName := e.Field()
			tag := e.Tag()
			param := e.Param()

			switch tag {
			case "required":
				errorMessages[fieldName] = fieldName + " là bắt buộc."
			case "email":
				errorMessages[fieldName] = "Định dạng email không hợp lệ."
			case "min":
				errorMessages[fieldName] = fieldName + " phải có ít nhất " + param + " ký tự."
			case "max":
				errorMessages[fieldName] = fieldName + " phải có tối đa " + param + " ký tự."
			case "uuid":
				errorMessages[fieldName] = fieldName + " phải là UUID hợp lệ."
			case "oneof":
				errorMessages[fieldName] = fieldName + " phải là một trong các giá trị: " + param + "."
			case "gte":
				errorMessages[fieldName] = fieldName + " phải lớn hơn hoặc bằng " + param + "."
			case "url":
				errorMessages[fieldName] = fieldName + " phải là URL hợp lệ."
			case "datetime":
				errorMessages[fieldName] = fieldName + " phải là ngày giờ hợp lệ."
			default:
				field := strings.Title(strings.ReplaceAll(fieldName, "_", " "))
				errorMessages[fieldName] = field + " không hợp lệ."
			}
		}
	} else {
		errorMessages["error"] = err.Error()
	}

	return errorMessages
}
