package vendors

import (
	"backend/internal/middleware"
	"backend/internal/wire"
	"github.com/labstack/echo"
)

type VendorRouter struct{}

func (VendorRouter *VendorRouter) InitVendorRouter(router *echo.Group) {
	vendorController, _ := wire.InitVendorRouterHandler()

	vendorRouterGroup := router.Group("/vendors")
	{
		vendorRouterGroup.GET("/:user_id", vendorController.GetVendor)
		vendorRouterGroup.GET("/", vendorController.GetAllVendors)
		vendorRouterGroup.POST("/new", vendorController.BecomeVendor, middleware.JWTMiddleware)
		vendorRouterGroup.PUT("/status", vendorController.UpdateVendorStatusByAdmin, middleware.JWTMiddleware)
	}
}
