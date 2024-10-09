package wire

import (
	"backend/internal/controller"
	"backend/internal/repository"
	"backend/internal/service"
	"github.com/google/wire"
)

func InitUserRouterHandlerr() (*controller.UserController, error) {
	wire.Build(
		repository.NewUserRepository,
		service.NewUserService,
		controller.NewUserController,
	)

	return new(controller.UserController), nil
}
