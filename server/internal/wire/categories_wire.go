package wire

import (
	"backend/internal/controller"
	"backend/internal/repository"
	"backend/internal/service"
	"github.com/google/wire"
)

func InitCategoriesRouterHandler() (*controller.CategoryController, error) {
	wire.Build(
		repository.NewCategoryRepository,
		service.NewCategoriesService,
		controller.NewCategoryController,
	)
	return new(controller.CategoryController), nil
}
