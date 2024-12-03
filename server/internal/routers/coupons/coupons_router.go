package coupons

import (
	"backend/internal/middleware"
	"backend/internal/wire"
	"github.com/labstack/echo"
)

type CouponRouter struct {
}

func (cr *CouponRouter) InitCouponRouter(router *echo.Group) {
	couponsController, _ := wire.InitCouponsRouterHandlerr()

	conditionGroup := router.Group("/conditions")
	{
		conditionGroup.POST("", couponsController.CreateCondition, middleware.JWTMiddleware)
	}
}
