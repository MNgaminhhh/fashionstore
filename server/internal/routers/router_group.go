package routers

import (
	"backend/internal/routers/upload"
	"backend/internal/routers/user"
	"backend/internal/routers/vendors"
)

type RouterGroup struct {
	User       *user.UserRouter
	Vendor     *vendors.VendorRouter
	UploadFile *upload.UploadFileRouter
}

var AllRouterGroup = &RouterGroup{
	User:       &user.UserRouter{},
	Vendor:     &vendors.VendorRouter{},
	UploadFile: &upload.UploadFileRouter{},
}
