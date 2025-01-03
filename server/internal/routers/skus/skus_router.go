package skus

import (
	"backend/internal/middleware"
	"backend/internal/wire"
	"github.com/labstack/echo"
)

type SKURouter struct {
}

func (sr *SKURouter) InitSKURouter(router *echo.Group) {
	skuController, _ := wire.InitSkuRouterRouterHandlerr()

	skusRouterGroup := router.Group("/skus")
	{
		skusRouterGroup.POST("", skuController.CreateSku, middleware.JWTMiddleware)
		skusRouterGroup.GET("/vendors", skuController.GetAllSkusOfVendor, middleware.JWTMiddleware)
		skusRouterGroup.GET("/:id", skuController.GetSkuById, middleware.JWTMiddleware)
		skusRouterGroup.PUT("/:id", skuController.UpdateSku, middleware.JWTMiddleware)
		skusRouterGroup.DELETE("/:id", skuController.DeleteSku, middleware.JWTMiddleware)
	}
}
