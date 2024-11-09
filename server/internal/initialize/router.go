package initialize

import (
	"backend/global"
	"backend/internal/controller"
	"backend/internal/routers"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

func InitRouter() *echo.Echo {
	e := echo.New()
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{echo.GET, echo.POST, echo.PUT, echo.DELETE},
		AllowCredentials: true,
	}))
	e.Validator = controller.NewCustomValidator()
	if global.Config.Server.Mode == "dev" {
		e.Debug = true
	} else {
		e.Debug = false
	}

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	userRouter := routers.AllRouterGroup.User
	vendorRouter := routers.AllRouterGroup.Vendor
	uploadFileRouter := routers.AllRouterGroup.UploadFile
	brandRouter := routers.AllRouterGroup.Brand
	bannersRouter := routers.AllRouterGroup.Banners
	MainGroup := e.Group("/api/v1")
	{
		userRouter.InitUserRouter(MainGroup)
		vendorRouter.InitVendorRouter(MainGroup)
		uploadFileRouter.InitUserRouter(MainGroup)
		brandRouter.InitRouter(MainGroup)
		bannersRouter.InitBannerRouter(MainGroup)
	}
	MainGroup.GET("/ok", func(c echo.Context) error {
		return c.JSON(200, map[string]string{"status": "OK"})
	})
	return e
}
