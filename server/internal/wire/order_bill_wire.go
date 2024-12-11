package wire

import (
	"backend/internal/controller"
	"backend/internal/repository"
	"backend/internal/service"
	"github.com/google/wire"
)

func InitOrderBillRouterHandler() (*controller.OrderBillsController, error) {
	wire.Build(
		repository.NewOrderBillsRepository,
		service.NewOrderBillsService,
		controller.NewOrderBillsController,
	)
	return new(controller.OrderBillsController), nil
}
