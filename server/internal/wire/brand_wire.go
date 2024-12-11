package wire

import (
	"backend/internal/controller"
	"backend/internal/repository"
	"backend/internal/service"
	"github.com/google/wire"
)

func InitBrandRouterHandler() (*controller.BrandsController, error) {
	wire.Build(
		repository.NewBrandsRepository,
		service.NewBrandsService,
		controller.NewBrandsController,
	)
	return new(controller.BrandsController), nil
}
