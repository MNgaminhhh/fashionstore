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
	}
}
