package services

import (
	"backend/internal/database"
	"backend/internal/service"
	"context"
	"database/sql"
	"github.com/labstack/echo"
	"net/http"
	"time"
)

type APIResponse struct {
	Data    map[string]interface{} `json:"data"`
	Code    int                    `json:"code"`
	Message string                 `json:"message"`
	Success bool                   `json:"success"`
}

type Handlers struct {
	db *sql.DB
}

func (h *Handlers) Home(c echo.Context) error {
	return c.JSON(http.StatusOK, "Hello")
}

func (h *Handlers) GetAllUsers(c echo.Context) error {
	ctx := context.Background()
	queries := database.New(h.db)
	allUsers, err := queries.GetAllUser(ctx)
	if err != nil {
		return c.JSON(http.StatusNotFound, err.Error())
	}
	return c.JSON(http.StatusOK, allUsers)
}

func (h *Handlers) Login(c echo.Context) error {
	email := c.FormValue("email")
	password := c.FormValue("password")

	ctx := context.Background()
	queries := database.New(h.db)
	user, err := queries.GetUserByEmail(ctx, email)
	if err != nil {
		res := APIResponse{
			Data:    nil,
			Code:    400,
			Message: "Email này chưa được đăng ký.",
			Success: false,
		}
		return c.JSON(http.StatusNotFound, res)
	}
	if user.Password != password {
		res := APIResponse{
			Data:    nil,
			Code:    400,
			Message: "Mật khẩu không chính xác.",
			Success: false,
		}
		return c.JSON(http.StatusNotFound, res)
	}
	auth := service.Auth{
		Issuer:        "mtshop.com",
		Audience:      "",
		Secret:        "",
		TokenExpiry:   time.Minute * 15,
		RefreshExpiry: time.Hour * 24,
		CookieDomain:  "localhost",
		CookiePath:    "/",
		CookieName:    "refresh_token",
	}

	tokens, err := auth.GenerateToken(&user)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}

	userMap := map[string]interface{}{
		"id":    user.ID,
		"email": user.Email,
	}

	data := map[string]interface{}{
		"tokens": tokens.Token,
		"user":   userMap,
	}

	res := APIResponse{
		Data:    data,
		Code:    200,
		Message: "Success",
		Success: true,
	}

	cookie := auth.GetRefreshCookie(tokens.RefreshToken)
	c.SetCookie(cookie)

	return c.JSON(http.StatusOK, res)
}
