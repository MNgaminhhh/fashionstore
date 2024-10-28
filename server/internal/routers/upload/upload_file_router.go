package upload

import (
	"backend/internal/middleware"
	"backend/internal/wire"
	"github.com/labstack/echo"
)

type UploadFileRouter struct{}

func (ur *UploadFileRouter) InitUserRouter(router *echo.Group) {
	uploadFileController, _ := wire.InitUploadFileRouterHandler()

	uploadFileGroup := router.Group("/file")
	{
		uploadFileGroup.POST("/upload", uploadFileController.UploadFile, middleware.JWTMiddleware)
	}
}
