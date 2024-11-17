package middleware

import (
	"backend/pkg/response"
	"github.com/labstack/echo"
)

func RoleMiddleware(allowedRoles ...string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			role, ok := c.Get("role").(string)
			if !ok {
				return response.ErrorResponse(c, response.ErrCodeForbidden, "Forbidden")
			}
			for _, allowedRole := range allowedRoles {
				if role == allowedRole {
					return next(c)
				}
			}
			return response.ErrorResponse(c, response.ErrCodeForbidden, "Forbidden")
		}
	}
}
