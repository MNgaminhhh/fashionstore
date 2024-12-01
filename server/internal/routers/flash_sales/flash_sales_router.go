package flash_sales

import (
	"backend/internal/middleware"
	"backend/internal/wire"
	"github.com/labstack/echo"
)

type FlashSalesRouter struct {
}

func (fr *FlashSalesRouter) InitFlashSalesRouter(router *echo.Group) {
	flashSalesController, _ := wire.InitFlashSaleRouterHandlerr()

	flashSalesRouterGroup := router.Group("/flash-sales")
	{
		flashSalesRouterGroup.POST("", flashSalesController.CreateFlashSales, middleware.JWTMiddleware)
		flashSalesRouterGroup.GET("", flashSalesController.GetFlashSales)
	}
}
