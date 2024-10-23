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
		//GET
		userRouterPublic.GET("/verify-email", userController.ActiveUser)

		//POST
		userRouterPublic.POST("/login", userController.Login)
		userRouterPublic.POST("/register", userController.CreateNewUser)
		userRouterPublic.POST("/forgot-password/send-email", userController.SendEmailResetPassword)
		userRouterPublic.POST("/verify-email/send-email", userController.SendEmailActiveUser)
		userRouterPublic.POST("/verify-email/resend", userController.ResendEmailActive)

		//PUT
		userRouterPublic.PUT("/update-status", userController.UpdateUserStatus)
		userRouterPublic.PUT("/forgot-password", userController.ForgetPassword)
	}
}
