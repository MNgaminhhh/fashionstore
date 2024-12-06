package wire

import (
	"backend/internal/controller"
	"backend/internal/repository"
	"backend/internal/service"
	"github.com/google/wire"
)

func InitReviewsRouterHandler() (*controller.ReviewsController, error) {
	wire.Build(
		repository.NewReviewsRepository,
		service.NewReviewsService,
		controller.NewReviewsController,
	)
	return new(controller.ReviewsController), nil
}
