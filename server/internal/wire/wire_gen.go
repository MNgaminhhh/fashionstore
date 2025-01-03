// Code generated by Wire. DO NOT EDIT.

//go:generate go run -mod=mod github.com/google/wire/cmd/wire
//go:build !wireinject
// +build !wireinject

package wire

import (
	"backend/internal/controller"
	"backend/internal/repository"
	"backend/internal/service"
)

// Injectors from banner_wire.go:

func InitBannerRouterHandlerr() (*controller.BannersController, error) {
	iBannersRepository := repository.NewBannersRepository()
	iBannersService := service.NewBannerService(iBannersRepository)
	bannersController := controller.NewBannersController(iBannersService)
	return bannersController, nil
}

// Injectors from brand_wire.go:

func InitBrandRouterHandlerr() (*controller.BrandsController, error) {
	iBrandsRepository := repository.NewBrandsRepository()
	iBrandsService := service.NewBrandsService(iBrandsRepository)
	brandsController := controller.NewBrandsController(iBrandsService)
	return brandsController, nil
}

// Injectors from cart_wire.go:

func InitCartRouterHandlerr() (*controller.CartController, error) {
	iCartRepository := repository.NewCartRepository()
	iCartService := service.NewCartService(iCartRepository)
	cartController := controller.NewCartController(iCartService)
	return cartController, nil
}

// Injectors from categories_wire.go:

func InitCategoriesRouterHandlerr() (*controller.CategoryController, error) {
	iCategoryRepository := repository.NewCategoryRepository()
	iCategoriesService := service.NewCategoriesService(iCategoryRepository)
	categoryController := controller.NewCategoryController(iCategoriesService)
	return categoryController, nil
}

// Injectors from coupons_wire.go:

func InitCouponsRouterHandlerr() (*controller.CouponsController, error) {
	iCouponsRepository := repository.NewCouponRepository()
	iCouponsService := service.NewCouponsService(iCouponsRepository)
	couponsController := controller.NewCouponsController(iCouponsService)
	return couponsController, nil
}

// Injectors from delivery_info_wire.go:

func InitDeliveryInfoRouterHandlerr() (*controller.DeliveryInfoController, error) {
	iDeliveryInfoRepository := repository.NewDeliveryInfoRepository()
	iDeliveryInfoService := service.NewDeliveryInfoService(iDeliveryInfoRepository)
	deliveryInfoController := controller.NewDeliveryInfoController(iDeliveryInfoService)
	return deliveryInfoController, nil
}

// Injectors from flash_sale_wire.go:

func InitFlashSaleRouterHandlerr() (*controller.FlashSalesController, error) {
	iFlashSalesRepository := repository.NewFlashSalesRepository()
	iFlashSalesService := service.NewFlashSalesService(iFlashSalesRepository)
	flashSalesController := controller.NewFlashSaleController(iFlashSalesService)
	return flashSalesController, nil
}

// Injectors from order_bill_wire.go:

func InitOrderBillRouterHandlerr() (*controller.OrderBillsController, error) {
	iOrderBillsRepository := repository.NewOrderBillsRepository()
	iOrderBillsService := service.NewOrderBillsService(iOrderBillsRepository)
	orderBillsController := controller.NewOrderBillsController(iOrderBillsService)
	return orderBillsController, nil
}

// Injectors from product_variant_wire.go:

func InitProductVariantRouterHandlerr() (*controller.ProductVariantsController, error) {
	iProductVariantsRepository := repository.NewProductVariantsRepository()
	iProductVariantsService := service.NewProductVariantsService(iProductVariantsRepository)
	productVariantsController := controller.NewProductVariantsController(iProductVariantsService)
	return productVariantsController, nil
}

// Injectors from products_wire.go:

func InitProductRouterHandlerr() (*controller.ProductController, error) {
	iProductRepository := repository.NewProductRepository()
	iProductService := service.NewProductService(iProductRepository)
	productController := controller.NewProductController(iProductService)
	return productController, nil
}

// Injectors from review_wire.go:

func InitReviewsRouterHandlerr() (*controller.ReviewsController, error) {
	iReviewsRepository := repository.NewReviewsRepository()
	iReviewsService := service.NewReviewsService(iReviewsRepository)
	reviewsController := controller.NewReviewsController(iReviewsService)
	return reviewsController, nil
}

// Injectors from shipping_rules_wire.go:

func InitShippingRulesRouterHandlerr() (*controller.ShippingRulesController, error) {
	iShippingRulesRepository := repository.NewShippingRulesRepository()
	iShippingRulesService := service.NewShippingRulesService(iShippingRulesRepository)
	shippingRulesController := controller.NewShippingRulesController(iShippingRulesService)
	return shippingRulesController, nil
}

// Injectors from sku_wire.go:

func InitSkuRouterRouterHandlerr() (*controller.SkusController, error) {
	iSkusRepository := repository.NewSkusRepository()
	iSkusService := service.NewSkusService(iSkusRepository)
	skusController := controller.NewSkusController(iSkusService)
	return skusController, nil
}

// Injectors from upload_wire.go:

func InitUploadFileRouterHandlerr() (*controller.UploadFileController, error) {
	iUploadFileRepository := repository.NewUploadFileRepository()
	iUploadFileService := service.NewUploadFileService(iUploadFileRepository)
	uploadFileController := controller.NewUploadFileController(iUploadFileService)
	return uploadFileController, nil
}

// Injectors from user_wire.go:

func InitUserRouterHandlerr() (*controller.UserController, error) {
	iUserRepository := repository.NewUserRepository()
	iUserService := service.NewUserService(iUserRepository)
	iAuthService := service.NewAuthService()
	userController := controller.NewUserController(iUserService, iAuthService)
	return userController, nil
}

// Injectors from vendor_wire.go:

func InitVendorRouterHandlerr() (*controller.VendorController, error) {
	iVendorRepository := repository.NewVendorRepository()
	iVendorService := service.NewVendorService(iVendorRepository)
	vendorController := controller.NewVendorController(iVendorService)
	return vendorController, nil
}
