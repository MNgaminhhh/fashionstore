package wire

import (
	"backend/internal/controller"
	"backend/internal/repository"
	"backend/internal/service"
	"github.com/google/wire"
)

func InitProductRouterHandler() (*controller.ProductController, error) {
	wire.Build(
		repository.NewProductRepository,
		service.NewProductService,
		controller.NewProductController,
	)
	return new(controller.ProductController), nil
}
