package user

import (
	"backend/internal/middleware"
	"backend/internal/wire"

	"github.com/labstack/echo"
)

type UserRouter struct{}

func (ur *UserRouter) InitUserRouter(router *echo.Group) {
	userController, _ := wire.InitUserRouterHandlerr()

	authRouterGroup := router.Group("/auth")
	{
		//GET
		authRouterGroup.GET("/verify-email", userController.ActiveUser)

		//POST
		authRouterGroup.POST("/login", userController.Login)
		authRouterGroup.POST("/register", userController.CreateNewUser)
		authRouterGroup.POST("/forgot-password/send-email", userController.SendEmailResetPassword)
		authRouterGroup.POST("/verify-email/send-email", userController.SendEmailActiveUser)
		authRouterGroup.POST("/verify-email/resend", userController.ResendEmailActive)

		//PUT
		authRouterGroup.PUT("/update-status", userController.UpdateUserStatus)
		authRouterGroup.PUT("/forgot-password", userController.ForgetPassword)
	}

	userRouterGroup := router.Group("/user")
	{
		userRouterGroup.GET("/profile", userController.GetUserInformation, middleware.JWTMiddleware)
		userRouterGroup.POST("/profile", userController.UpdateUser, middleware.JWTMiddleware)
		userRouterGroup.GET("/all", userController.GetAllUsers)
		userRouterGroup.PUT("/admin/update-status", userController.AdminUpdateStatusUser, middleware.JWTMiddleware)
	}
}
