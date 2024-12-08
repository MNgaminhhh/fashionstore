package product

import (
	"backend/internal/middleware"
	"backend/internal/wire"
	"github.com/labstack/echo"
)

type ProductRouter struct {
}

func (cr *ProductRouter) InitProductRouter(router *echo.Group) {
	productController, _ := wire.InitProductRouterHandlerr()

	productGroup := router.Group("/products")
	{
		productGroup.GET("", productController.ListProducts)
		productGroup.GET("/vendor", productController.ListProductsOfVendor, middleware.JWTMiddleware)
		productGroup.GET("/:id", productController.GetProductByID)
		productGroup.GET("/detail/:slug", productController.ViewFullDetailOfProduct)
		productGroup.POST("", productController.AddProduct, middleware.JWTMiddleware)
		productGroup.PUT("/:id", productController.UpdateProduct, middleware.JWTMiddleware)
		productGroup.DELETE("/:id", productController.DeleteProductByID, middleware.JWTMiddleware)
	}
}
