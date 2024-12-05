package delivery_info

import (
	"backend/internal/middleware"
	"backend/internal/wire"
	"github.com/labstack/echo"
)

type DeliveryInfoRouter struct {
}

func (d *DeliveryInfoRouter) InitDeliveryInfoRouter(router *echo.Group) {
	deliveryController, _ := wire.InitDeliveryInfoRouterHandlerr()
	deliveryControllerGroup := router.Group("/delivery_info")
	{
		deliveryControllerGroup.POST("", deliveryController.CreateDeliveryInfo, middleware.JWTMiddleware)
		deliveryControllerGroup.GET("", deliveryController.GetAllDeliveryByUserId, middleware.JWTMiddleware)
		deliveryControllerGroup.GET("/:id", deliveryController.GetDeliveryInfoById, middleware.JWTMiddleware)
		deliveryControllerGroup.PUT("/:id", deliveryController.UpdateDeliveryInfo, middleware.JWTMiddleware)
		deliveryControllerGroup.DELETE("/:id", deliveryController.DeleteDeliveryInfoById, middleware.JWTMiddleware)
	}
}
