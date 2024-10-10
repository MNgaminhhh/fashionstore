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
		userRouterPublic.POST("/forgot-password/send-email", userController.SendEmailResetPassword)
		userRouterPublic.POST("/forgot-password", userController.ForgetPassword)
		userRouterPublic.POST("/verify-email/send-email", userController.SendEmailActiveUser)
		userRouterPublic.GET("/verify-email", userController.ActiveUser)
	}
}
