package order_bill

import (
	"backend/internal/middleware"
	"backend/internal/wire"
	"github.com/labstack/echo"
)

type OrderBillRouter struct {
}

func (or *OrderBillRouter) InitOrderBillRouter(router *echo.Group) {
	orderBillController, _ := wire.InitOrderBillRouterHandlerr()

	orderRouter := router.Group("/order_bills")
	{
		orderRouter.GET("/vendor", orderBillController.GetAllOrderBillsOfVendor, middleware.JWTMiddleware)
		orderRouter.POST("", orderBillController.CreateOrderBill, middleware.JWTMiddleware)
	}
}
