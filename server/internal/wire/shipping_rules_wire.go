package wire

import (
	"backend/internal/controller"
	"backend/internal/repository"
	"backend/internal/service"
	"github.com/google/wire"
)

func InitShippingRulesRouterHandler() (*controller.ShippingRulesController, error) {
	wire.Build(
		repository.NewShippingRulesRepository,
		service.NewShippingRulesService,
		controller.NewShippingRulesController,
	)

	return new(controller.ShippingRulesController), nil
}
