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
		orderRouter.GET("/admin", orderBillController.GetAllOrderBillsOfAdmin, middleware.JWTMiddleware)
		orderRouter.GET("/user", orderBillController.GetAllOrderBillsOfUser, middleware.JWTMiddleware)
		orderRouter.GET("/:id", orderBillController.GetOrderBillById)
		orderRouter.PUT("/vendor/:id", orderBillController.UpdateOrderBillOfVendor, middleware.JWTMiddleware)
		orderRouter.PUT("/admin/:id", orderBillController.UpdateOrderStatusByAdmin, middleware.JWTMiddleware)
		orderRouter.POST("", orderBillController.CreateOrderBill, middleware.JWTMiddleware)
		orderRouter.POST("/callback", orderBillController.WebHookUrl)
		orderRouter.DELETE("/cancel/:orderCode", orderBillController.CancelPayment)
	}
}
