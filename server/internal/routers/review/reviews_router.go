package review

import (
	"backend/internal/middleware"
	"backend/internal/wire"
	"github.com/labstack/echo"
)

type ReviewsRouter struct {
}

func (r *ReviewsRouter) InitReviewRouter(router *echo.Group) {
	reviewController, _ := wire.InitReviewsRouterHandlerr()

	reviewRouterGroup := router.Group("/reviews")
	{
		reviewRouterGroup.POST("", reviewController.CreateReview, middleware.JWTMiddleware)
		reviewRouterGroup.PUT("/:id", reviewController.UpdateReview, middleware.JWTMiddleware)
		reviewRouterGroup.DELETE("/:id", reviewController.DeleteReview, middleware.JWTMiddleware)
	}

	commentRouterGroup := router.Group("/comments")
	{
		commentRouterGroup.POST("", reviewController.CreateComment, middleware.JWTMiddleware)
		commentRouterGroup.PUT("/:id", reviewController.UpdateComment, middleware.JWTMiddleware)
		commentRouterGroup.DELETE("/:id", reviewController.DeleteComment, middleware.JWTMiddleware)
	}
}
