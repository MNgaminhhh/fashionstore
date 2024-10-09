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
	e.Validator = controller.NewCustomValidator()
	if global.Config.Server.Mode == "dev" {
		e.Debug = true
	} else {
		e.Debug = false
	}

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	userRouter := routers.AllRouterGroup.User
	MainGroup := e.Group("/api/v1")
	{
		userRouter.InitUserRouter(MainGroup)
	}
	MainGroup.GET("/ok", func(c echo.Context) error {
		return c.JSON(200, map[string]string{"status": "OK"})
	})
	return e
}
