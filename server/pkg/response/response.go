package response

import (
	"github.com/labstack/echo"
	"net/http"
)

type ResponseData struct {
	Code    int         `json:"code"`
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
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

func Msg(code int) string {
	if message, ok := msg[code]; ok {
		return message
	}
	return "Lỗi !!!"
}
