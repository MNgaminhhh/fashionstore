package product_variant

import (
	"backend/internal/middleware"
	"backend/internal/wire"
	"github.com/labstack/echo"
)

type ProductRouter struct {
}

func (cr *ProductRouter) InitProductVariantRouter(router *echo.Group) {
	productVariantController, _ := wire.InitProductVariantHandlerRouter()

	productGroup := router.Group("/product-variants")
	{
		productGroup.GET("", productVariantController.GetAllProductVariants)
		productGroup.GET("/:id", productVariantController.GetProductVariantById)
		productGroup.POST("", productVariantController.CreateProductVariantController, middleware.JWTMiddleware)
		productGroup.PUT("/:id", productVariantController.UpdateProductVariantById, middleware.JWTMiddleware)
		productGroup.DELETE("/:id", productVariantController.DeleteProductVariantById, middleware.JWTMiddleware)
	}
}
