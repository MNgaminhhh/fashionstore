package wire

import (
	"backend/internal/controller"
	"backend/internal/repository"
	"backend/internal/service"
	"github.com/google/wire"
)

func InitCouponsRouterHandler() (*controller.CouponsController, error) {
	wire.Build(
		repository.NewCouponRepository,
		service.NewCouponsService,
		controller.NewCouponsController)
	return new(controller.CouponsController), nil
}
