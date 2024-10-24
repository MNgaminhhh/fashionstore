package vendors

import (
	"backend/internal/middleware"
	"backend/internal/wire"
	"github.com/labstack/echo"
)

type VendorRouter struct{}

func (VendorRouter *VendorRouter) InitVendorRouter(router *echo.Group) {
	vendorController, _ := wire.InitVendorRouterHandler()

	vendorRouterGroup := router.Group("/vendor")
	{
		vendorRouterGroup.POST("/new", vendorController.BecomeVendor, middleware.JWTMiddleware)
	}
}
