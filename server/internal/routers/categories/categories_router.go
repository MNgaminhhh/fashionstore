package categories

import (
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

		categoriesGroup.GET("/", categoryController.GetFullCate)
	}
}
