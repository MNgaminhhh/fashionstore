package routers

import (
	"backend/internal/routers/banner"
	"backend/internal/routers/brand"
	"backend/internal/routers/categories"
	"backend/internal/routers/product"
	"backend/internal/routers/product_variant"
	"backend/internal/routers/skus"
	"backend/internal/routers/upload"
	"backend/internal/routers/user"
	"backend/internal/routers/vendors"
)

type RouterGroup struct {
	User            *user.UserRouter
	Vendor          *vendors.VendorRouter
	UploadFile      *upload.UploadFileRouter
	Brand           *brand.BrandRouter
	Categories      *categories.CategoryRouter
	Banners         *banner.BannerRouter
	Products        *product.ProductRouter
	ProductVariants *product_variant.ProductRouter
	SKUs            *skus.SKURouter
}

var AllRouterGroup = &RouterGroup{
	User:            &user.UserRouter{},
	Vendor:          &vendors.VendorRouter{},
	UploadFile:      &upload.UploadFileRouter{},
	Brand:           &brand.BrandRouter{},
	Categories:      &categories.CategoryRouter{},
	Banners:         &banner.BannerRouter{},
	Products:        &product.ProductRouter{},
	ProductVariants: &product_variant.ProductRouter{},
	SKUs:            &skus.SKURouter{},
}
