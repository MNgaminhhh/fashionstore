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
		flashSalesRouterGroup.GET("", flashSalesController.GetFlashSales)
		flashSalesRouterGroup.GET("/:id", flashSalesController.GetFlashSalesByID)
		flashSalesRouterGroup.POST("", flashSalesController.CreateFlashSales, middleware.JWTMiddleware)
		flashSalesRouterGroup.PUT("/:id", flashSalesController.UpdateFlashSales, middleware.JWTMiddleware)
		flashSalesRouterGroup.DELETE("/:id", flashSalesController.DeleteFlashSales, middleware.JWTMiddleware)
	}

	flashSaleItemsRouterGroup := router.Group("/flash-sale-items")
	{
		flashSaleItemsRouterGroup.GET("/flash-sale/:flashSaleId", flashSalesController.GetAllFlashSaleItemsByFlashSaleId)
		flashSaleItemsRouterGroup.GET("/:id", flashSalesController.GetFlashSaleItemById)
		flashSaleItemsRouterGroup.DELETE("/:id", flashSalesController.DeleteFlashSaleItem, middleware.JWTMiddleware)
		flashSaleItemsRouterGroup.PUT("/:id", flashSalesController.UpdateFlashSaleItem, middleware.JWTMiddleware)
		flashSaleItemsRouterGroup.POST("", flashSalesController.CreateFlashSaleItem, middleware.JWTMiddleware)
	}
}
