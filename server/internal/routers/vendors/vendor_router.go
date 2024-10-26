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
		vendorRouterGroup.GET("/:user_id", vendorController.GetVendor)
		vendorRouterGroup.POST("/new", vendorController.BecomeVendor, middleware.JWTMiddleware)
		vendorRouterGroup.PUT("/status", vendorController.UpdateVendorStatusByAdmin, middleware.JWTMiddleware)
	}
}
