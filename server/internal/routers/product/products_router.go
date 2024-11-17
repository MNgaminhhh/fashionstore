package product

import (
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
		productGroup.GET("/:id", productController.GetProductByID)
		productGroup.POST("", productController.AddProduct)
		productGroup.PUT("/:id", productController.UpdateProduct)
		productGroup.DELETE("/:id", productController.DeleteProductByID)
	}
}
