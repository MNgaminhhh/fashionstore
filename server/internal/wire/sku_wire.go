package wire

import (
	"backend/internal/controller"
	"backend/internal/repository"
	"backend/internal/service"
	"github.com/google/wire"
)

func InitSkuRouterRouterHandler() (*controller.SkusController, error) {
	wire.Build(
		repository.NewSkusRepository,
		service.NewSkusService,
		controller.NewSkusController,
	)
	return new(controller.SkusController), nil
}
