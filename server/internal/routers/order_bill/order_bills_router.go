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
		orderRouter.POST("", orderBillController.CreateOrderBill, middleware.JWTMiddleware)
	}
}
