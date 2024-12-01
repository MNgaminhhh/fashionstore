package wire

import (
	"backend/internal/controller"
	"backend/internal/repository"
	"backend/internal/service"
	"github.com/google/wire"
)

func InitFlashSaleRouterHandler() (*controller.FlashSalesController, error) {
	wire.Build(
		repository.NewFlashSalesRepository,
		service.NewFlashSalesService,
		controller.NewFlashSaleController,
	)
	return new(controller.FlashSalesController), nil
}
