package vendors

import (
	"backend/internal/middleware"
	"backend/internal/wire"

	"github.com/labstack/echo"
)

type VendorRouter struct{}

func (VendorRouter *VendorRouter) InitVendorRouter(router *echo.Group) {
	vendorController, _ := wire.InitVendorRouterHandlerr()

	vendorRouterGroup := router.Group("/vendors")
	{
		vendorRouterGroup.GET("/:vendor_id", vendorController.GetVendor)
		vendorRouterGroup.GET("/", vendorController.GetAllVendors)
		vendorRouterGroup.POST("/new", vendorController.BecomeVendor, middleware.JWTMiddleware)
		vendorRouterGroup.PUT("/status", vendorController.UpdateVendorStatusByAdmin, middleware.JWTMiddleware)
		vendorRouterGroup.PUT("", vendorController.UpdateVendor, middleware.JWTMiddleware)
	}
}
