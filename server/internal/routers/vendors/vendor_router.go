package vendors

import (
	"github.com/labstack/echo"
)

type VendorRouter struct{}

func (VendorRouter *VendorRouter) InitVendorRouter(router *echo.Group) {
	//vendorController, _ := wire.InitVendorRouterHandler()
}
