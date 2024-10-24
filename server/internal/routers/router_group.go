package routers

import (
	"backend/internal/routers/user"
	"backend/internal/routers/vendors"
)

type RouterGroup struct {
	User   *user.UserRouter
	Vendor *vendors.VendorRouter
}

var AllRouterGroup = &RouterGroup{
	User:   &user.UserRouter{},
	Vendor: &vendors.VendorRouter{},
}
