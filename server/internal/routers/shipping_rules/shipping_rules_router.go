package shipping_rules

import (
	"backend/internal/middleware"
	"backend/internal/wire"
	"github.com/labstack/echo"
)

type ShippingRuleRouter struct {
}

func (sr *ShippingRuleRouter) InitShippingRuleRouter(router *echo.Group) {
	shippingRuleController, _ := wire.InitShippingRulesRouterHandlerr()

	shippingRuleGroup := router.Group("/shipping_rules")
	{
		shippingRuleGroup.POST("", shippingRuleController.CreateShippingRule, middleware.JWTMiddleware)
		shippingRuleGroup.GET("", shippingRuleController.GetAllShippingRules)
		shippingRuleGroup.GET("/:id", shippingRuleController.GetShippingRuleById)
		shippingRuleGroup.PUT("/:id", shippingRuleController.UpdateShippingRule, middleware.JWTMiddleware)
		shippingRuleGroup.DELETE("/:id", shippingRuleController.DeleteShippingRuleById, middleware.JWTMiddleware)
	}
}
