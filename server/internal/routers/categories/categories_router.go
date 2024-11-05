package categories

import (
	"backend/internal/middleware"
	"backend/internal/wire"
	"github.com/labstack/echo"
)

type CategoryRouter struct {
}

func (cr *CategoryRouter) InitCategoryRouter(router *echo.Group) {
	categoryController, _ := wire.InitCategoriesRouterHandler()

	categoriesGroup := router.Group("/categories")
	{
		categoriesGroup.POST("/", categoryController.AddNewCategory)
		categoriesGroup.POST("/sub", categoryController.AddSubCate)
		categoriesGroup.POST("/child", categoryController.AddChildCate)

		categoriesGroup.GET("/full-tree", categoryController.GetFullCate)

		categoriesGroup.GET("/all", categoryController.GetAllCates)
		categoriesGroup.GET("/:id", categoryController.GetCategoryById)

		categoriesGroup.PUT("/:id", categoryController.UpdateCateById, middleware.JWTMiddleware)

		categoriesGroup.DELETE("/:id", categoryController.DeleteCateById, middleware.JWTMiddleware)
	}
}
