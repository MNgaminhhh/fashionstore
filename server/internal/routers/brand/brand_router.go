package brand

import (
	"backend/internal/middleware"
	"backend/internal/wire"
	"github.com/labstack/echo"
)

type BrandRouter struct{}

func (br *BrandRouter) InitRouter(router *echo.Group) {
	brandController, _ := wire.InitBrandRouterHandler()

	brandRouterGroup := router.Group("/brands")
	{
		brandRouterGroup.GET("/", brandController.GetBrands, middleware.JWTMiddleware)
		brandRouterGroup.POST("/:id", brandController.UpdateBrand, middleware.JWTMiddleware)
	}
}
