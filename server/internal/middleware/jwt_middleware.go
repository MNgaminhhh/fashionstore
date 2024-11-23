package middleware

import (
	"backend/internal/database"
	"backend/pkg/response"
	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo"
	"log"
	"os"
	"strings"
)

type jwtCustomClaims struct {
	Email string            `json:"email"`
	Role  database.UserRole `json:"role"`
	jwt.StandardClaims
}

func JWTMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		authHeader := c.Request().Header.Get("Authorization")
		if authHeader == "" {
			return response.ErrorResponse(c, response.ErrCodeUnauthorized, "Unauthorized")
		}
		if strings.HasPrefix(authHeader, "Bearer ") {
			tokenString := strings.TrimPrefix(authHeader, "Bearer ")
			token, err := jwt.ParseWithClaims(tokenString, &jwtCustomClaims{}, func(token *jwt.Token) (interface{}, error) {
				return []byte(os.Getenv("ACCESS_SECRET")), nil
			})
			if err != nil {
				return response.ErrorResponse(c, response.ErrCodeUnauthorized, "Unauthorized")
			}

			if claims, ok := token.Claims.(*jwtCustomClaims); ok && token.Valid {
				c.Set("uuid", claims.Subject)
				c.Set("email", claims.Email)
				c.Set("role", string(claims.Role))
				log.Println("-----", claims.Subject)
				return next(c)
			}
		}
		return response.ErrorResponse(c, response.ErrCodeUnauthorized, "Unauthorized")
	}
}
