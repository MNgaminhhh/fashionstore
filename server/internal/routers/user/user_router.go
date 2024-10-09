package user

import (
	"backend/internal/wire"
	"github.com/labstack/echo"
)

type UserRouter struct{}

func (ur *UserRouter) InitUserRouter(router *echo.Group) {
	userController, _ := wire.InitUserRouterHandler()

	userRouterPublic := router.Group("/auth")
	{
		userRouterPublic.POST("/login", userController.Login)
		userRouterPublic.PUT("/update-status", userController.UpdateUserStatus)
		userRouterPublic.POST("/register", userController.CreateNewUser)
	}
}
