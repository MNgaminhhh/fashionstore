package wire

import (
	"backend/internal/controller"
	"backend/internal/repository"
	"backend/internal/service"
	"github.com/google/wire"
)

func InitUploadFileRouterHandlerr() (*controller.UploadFileController, error) {
	wire.Build(
		repository.NewUploadFileRepository,
		service.NewUploadFileService,
		controller.NewUploadFileController,
	)

	return new(controller.UploadFileController), nil
}
