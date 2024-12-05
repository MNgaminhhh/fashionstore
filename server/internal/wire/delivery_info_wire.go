package wire

import (
	"backend/internal/controller"
	"backend/internal/repository"
	"backend/internal/service"
	"github.com/google/wire"
)

func InitDeliveryInfoRouterHandler() (*controller.DeliveryInfoController, error) {
	wire.Build(
		repository.NewDeliveryInfoRepository,
		service.NewDeliveryInfoService,
		controller.NewDeliveryInfoController,
	)
	return new(controller.DeliveryInfoController), nil
}
