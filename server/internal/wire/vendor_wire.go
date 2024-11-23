package wire

import (
	"backend/internal/controller"
	"backend/internal/repository"
	"backend/internal/service"
	"github.com/google/wire"
)

func InitVendorRouterHandler() (*controller.VendorController, error) {
	wire.Build(
		repository.NewVendorRepository,
		service.NewVendorService,
		controller.NewVendorController,
	)

	return new(controller.VendorController), nil
}
