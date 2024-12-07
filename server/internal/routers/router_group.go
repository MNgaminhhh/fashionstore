package routers

import (
	"backend/internal/routers/banner"
	"backend/internal/routers/brand"
	"backend/internal/routers/cart"
	"backend/internal/routers/categories"
	"backend/internal/routers/coupons"
	"backend/internal/routers/delivery_info"
	"backend/internal/routers/flash_sales"
	"backend/internal/routers/order_bill"
	"backend/internal/routers/product"
	"backend/internal/routers/product_variant"
	"backend/internal/routers/review"
	"backend/internal/routers/shipping_rules"
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
	FlashSales      *flash_sales.FlashSalesRouter
	Coupons         *coupons.CouponRouter
	ShippingRules   *shipping_rules.ShippingRuleRouter
	DeliveryInfo    *delivery_info.DeliveryInfoRouter
	Cart            *cart.CartRouter
	Review          *review.ReviewsRouter
	OrderBill       *order_bill.OrderBillRouter
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
	FlashSales:      &flash_sales.FlashSalesRouter{},
	Coupons:         &coupons.CouponRouter{},
	ShippingRules:   &shipping_rules.ShippingRuleRouter{},
	DeliveryInfo:    &delivery_info.DeliveryInfoRouter{},
	Cart:            &cart.CartRouter{},
	Review:          &review.ReviewsRouter{},
	OrderBill:       &order_bill.OrderBillRouter{},
}
