package wire

import (
	"backend/internal/controller"
	"backend/internal/repository"
	"backend/internal/service"
	"github.com/google/wire"
)

func InitCartRouterHandler() (*controller.CartController, error) {
	wire.Build(
		repository.NewCartRepository,
		service.NewCartService,
		controller.NewCartController,
	)
	return new(controller.CartController), nil
}
