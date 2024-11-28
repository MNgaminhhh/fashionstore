package product_variant

import (
	"backend/internal/middleware"
	"backend/internal/wire"
	"github.com/labstack/echo"
)

type ProductRouter struct {
}

func (cr *ProductRouter) InitProductVariantRouter(router *echo.Group) {
	productVariantController, _ := wire.InitProductVariantRouterHandlerr()

	productVariantGroup := router.Group("/product-variants")
	{
		productVariantGroup.GET("", productVariantController.GetAllProductVariants)
		productVariantGroup.GET("/:id", productVariantController.GetProductVariantById)
		productVariantGroup.POST("", productVariantController.CreateProductVariantController, middleware.JWTMiddleware)
		productVariantGroup.PUT("/:id", productVariantController.UpdateProductVariantById, middleware.JWTMiddleware)
		productVariantGroup.DELETE("/:id", productVariantController.DeleteProductVariantById, middleware.JWTMiddleware)
	}

	variantOptionGroup := router.Group("/variant-options")
	{
		variantOptionGroup.GET("/:id", productVariantController.GetListVariantOptionsByPvId)
		variantOptionGroup.POST("", productVariantController.CreateProductVariantOptions, middleware.JWTMiddleware)
		variantOptionGroup.PUT("/:id", productVariantController.UpdateVariantOptionsById, middleware.JWTMiddleware)
		variantOptionGroup.DELETE("/:id", productVariantController.DeleteVariantOptionsByPvId, middleware.JWTMiddleware)
	}
}
