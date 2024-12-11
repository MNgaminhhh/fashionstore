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
		conditionGroup.GET("", couponsController.GetAllCondition)
		conditionGroup.GET("/:id", couponsController.GetConditionById)
		conditionGroup.PUT("/:id", couponsController.UpdateCondition, middleware.JWTMiddleware)
		conditionGroup.DELETE("/:id", couponsController.DeleteCondition, middleware.JWTMiddleware)
	}

	couponGroup := router.Group("/coupons")
	{
		couponGroup.POST("", couponsController.CreateCoupon, middleware.JWTMiddleware)
		couponGroup.GET("", couponsController.GetAllCoupons)
		couponGroup.GET("/:id", couponsController.GetCouponById)
		couponGroup.GET("/can-use", couponsController.GetAllCouponsCanUse, middleware.JWTMiddleware)
		couponGroup.PUT("/status/:id", couponsController.UpdateCouponStatus, middleware.JWTMiddleware)
		couponGroup.PUT("/:id", couponsController.UpdateCouponById, middleware.JWTMiddleware)
	}
}
