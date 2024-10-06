package server

import (
	"backend/services"
	"database/sql"
	"github.com/labstack/echo"
)

func SetupRoutes(e *echo.Echo, db *sql.DB) {
	h := services.NewHandlers(db)
	e.GET("/", h.Home)
	e.GET("/allUsers", h.GetAllUsers)
	e.POST("/login", h.Login)
}
