package wire

import (
	"backend/internal/controller"
	"backend/internal/repository"
	"backend/internal/service"
	"github.com/google/wire"
)

func InitProductVariantRouterHandler() (*controller.ProductVariantsController, error) {
	wire.Build(
		repository.NewProductVariantsRepository,
		service.NewProductVariantsService,
		controller.NewProductVariantsController,
	)
	return new(controller.ProductVariantsController), nil
}
