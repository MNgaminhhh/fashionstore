package cart

import (
	"backend/internal/middleware"
	"backend/internal/wire"
	"github.com/labstack/echo"
)

type CartRouter struct {
}

func (cr *CartRouter) InitCartRouter(router *echo.Group) {
	cartController, _ := wire.InitCartRouterHandlerr()

	cartRouterGroup := router.Group("/cart")
	{
		cartRouterGroup.POST("", cartController.AddNewItem, middleware.JWTMiddleware)
		cartRouterGroup.GET("", cartController.GetAllSkuItemInCart, middleware.JWTMiddleware)
		cartRouterGroup.DELETE("/:id", cartController.RemoveItem, middleware.JWTMiddleware)
	}
}
