package wire

import (
	"backend/internal/controller"
	"backend/internal/repository"
	"backend/internal/service"
	"github.com/google/wire"
)

func InitBannerRouterHandler() (*controller.BannersController, error) {
	wire.Build(
		repository.NewBannersRepository,
		service.NewBannerService,
		controller.NewBannersController,
	)
	return new(controller.BannersController), nil
}
