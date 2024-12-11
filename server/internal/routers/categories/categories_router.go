package categories

import (
	"backend/internal/middleware"
	"backend/internal/wire"
	"github.com/labstack/echo"
)

type CategoryRouter struct {
}

func (cr *CategoryRouter) InitCategoryRouter(router *echo.Group) {
	categoryController, _ := wire.InitCategoriesRouterHandlerr()

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

		categoriesGroup.GET("/sub/all", categoryController.GetAllSubCates)
		categoriesGroup.GET("/sub/:id", categoryController.GetSubCateById)
		categoriesGroup.PUT("/sub/:id", categoryController.UpdateSubCateById, middleware.JWTMiddleware)
		categoriesGroup.DELETE("/sub/:id", categoryController.DeleteSubCateById, middleware.JWTMiddleware)

		categoriesGroup.GET("/child/all", categoryController.GetAllChildCates)
		categoriesGroup.GET("/child/:id", categoryController.GetChildCateById)
		categoriesGroup.PUT("/child/:id", categoryController.UpdateChildCateById, middleware.JWTMiddleware)
		categoriesGroup.DELETE("/child/:id", categoryController.DeleteChildCateById, middleware.JWTMiddleware)
	}
}
