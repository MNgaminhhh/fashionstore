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
		brandRouterGroup.GET("/", brandController.GetBrands)
		brandRouterGroup.GET("/:id", brandController.GetBrandById)
		brandRouterGroup.PUT("/:id", brandController.UpdateBrand, middleware.JWTMiddleware)
		brandRouterGroup.DELETE("/:id", brandController.DeleteBrand, middleware.JWTMiddleware)
		brandRouterGroup.POST("/", brandController.AddBrand, middleware.JWTMiddleware)
	}
}
