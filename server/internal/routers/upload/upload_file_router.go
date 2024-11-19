package upload

import (
	"backend/internal/middleware"
	"backend/internal/wire"

	"github.com/labstack/echo"
)

type UploadFileRouter struct{}

func (ur *UploadFileRouter) InitUploadFileRouter(router *echo.Group) {
	uploadFileController, _ := wire.InitUploadFileRouterHandlerr()

	uploadFileGroup := router.Group("/file")
	{
		uploadFileGroup.POST("/upload", uploadFileController.UploadFile, middleware.JWTMiddleware)
	}
}
