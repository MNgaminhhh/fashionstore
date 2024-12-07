package initialize

import (
	"backend/global"
	"backend/internal/controller"
	"backend/internal/routers"
	"fmt"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"strings"
)

func InitRouter() *echo.Echo {
	e := echo.New()
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{echo.GET, echo.POST, echo.PUT, echo.DELETE},
		AllowCredentials: true,
	}))
	e.Validator = controller.NewCustomValidator()
	if global.Config.Server.Mode == "dev" {
		e.Debug = true
	} else {
		e.Debug = false
	}

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	userRouter := routers.AllRouterGroup.User
	vendorRouter := routers.AllRouterGroup.Vendor
	uploadFileRouter := routers.AllRouterGroup.UploadFile
	brandRouter := routers.AllRouterGroup.Brand
	cateRouter := routers.AllRouterGroup.Categories
	bannersRouter := routers.AllRouterGroup.Banners
	productRouter := routers.AllRouterGroup.Products
	productVariantRouter := routers.AllRouterGroup.ProductVariants
	skusRouter := routers.AllRouterGroup.SKUs
	flashSalesRouter := routers.AllRouterGroup.FlashSales
	couponsRouter := routers.AllRouterGroup.Coupons
	shippingRulesRouter := routers.AllRouterGroup.ShippingRules
	deliveryInfoRouter := routers.AllRouterGroup.DeliveryInfo
	cartRouter := routers.AllRouterGroup.Cart
	reviewRouter := routers.AllRouterGroup.Review
	MainGroup := e.Group("/api/v1")
	{
		userRouter.InitUserRouter(MainGroup)
		vendorRouter.InitVendorRouter(MainGroup)
		uploadFileRouter.InitUploadFileRouter(MainGroup)
		brandRouter.InitRouter(MainGroup)
		cateRouter.InitCategoryRouter(MainGroup)
		bannersRouter.InitBannerRouter(MainGroup)
		productRouter.InitProductRouter(MainGroup)
		productVariantRouter.InitProductVariantRouter(MainGroup)
		skusRouter.InitSKURouter(MainGroup)
		flashSalesRouter.InitFlashSalesRouter(MainGroup)
		couponsRouter.InitCouponRouter(MainGroup)
		shippingRulesRouter.InitShippingRuleRouter(MainGroup)
		deliveryInfoRouter.InitDeliveryInfoRouter(MainGroup)
		cartRouter.InitCartRouter(MainGroup)
		reviewRouter.InitReviewRouter(MainGroup)
	}
	MainGroup.GET("/ok", func(c echo.Context) error {
		return c.JSON(200, map[string]string{"status": "OK"})
	})
	logAllRoutes(e)
	return e
}

func logAllRoutes(e *echo.Echo) {
	fmt.Println("=== Registered Routes ===")
	for _, route := range e.Routes() {
		if strings.Contains(route.Path, "*") {
			continue
		}
		standardMethods := map[string]bool{
			echo.GET:     true,
			echo.POST:    true,
			echo.PUT:     true,
			echo.DELETE:  true,
			echo.PATCH:   true,
			echo.HEAD:    true,
			echo.OPTIONS: true,
		}

		if _, ok := standardMethods[route.Method]; !ok {
			continue
		}

		fmt.Printf("Method: %-6s Path: %s\n", route.Method, route.Path)
	}
	fmt.Println("=========================")
}
