package repository

import (
	"backend/global"
	"backend/internal/database"
	"backend/internal/validator"
	"encoding/json"
	"github.com/google/uuid"
)

type IReviewsRepository interface {
	CreateReview(userId uuid.UUID, customParam validator.CreateReviewValidator) error
	GetAllReviewsByProductId(productId uuid.UUID) ([]database.GetAllReviewsByProductIdRow, error)
	GetReviewById(id uuid.UUID) (*database.Review, error)
	UpdateReview(review *database.Review) error
	DeleteReview(id uuid.UUID, userId uuid.UUID) error

	CreateComment(userId uuid.UUID, customParam validator.CreateCommentValidator) error
	GetAllCommentsByReviewId(reviewId uuid.UUID) ([]database.GetAllCommentsByReviewIdRow, error)
	GetCommentById(id uuid.UUID) (*database.Comment, error)
	UpdateComment(comment *database.Comment) error
	DeleteComment(id uuid.UUID) error
}

type ReviewsRepository struct {
	sqlc *database.Queries
}

func (r ReviewsRepository) CreateReview(userId uuid.UUID, customParam validator.CreateReviewValidator) error {
	skuId, _ := uuid.Parse(customParam.SkuId)
	orderId, _ := uuid.Parse(customParam.OrderId)
	comments := customParam.Comment
	commentJSON, _ := json.Marshal(comments)
	param := database.CreateReviewParams{
		UserID:  userId,
		SkuID:   skuId,
		OrderID: orderId,
		Rating:  customParam.Rating,
		Comment: commentJSON,
	}
	err := r.sqlc.CreateReview(ctx, param)
	return err
}

func (r ReviewsRepository) GetAllReviewsByProductId(productId uuid.UUID) ([]database.GetAllReviewsByProductIdRow, error) {
	results, err := r.sqlc.GetAllReviewsByProductId(ctx, productId)
	if err != nil {
		return nil, err
	}
	return results, nil
}

func (r ReviewsRepository) GetReviewById(id uuid.UUID) (*database.Review, error) {
	review, err := r.sqlc.GetReviewById(ctx, id)
	if err != nil {
		return nil, err
	}
	return &review, nil
}

func (r ReviewsRepository) UpdateReview(review *database.Review) error {
	param := database.UpdateReviewByIdParams{
		Rating:  review.Rating,
		Comment: review.Comment,
		ID:      review.ID,
	}
	err := r.sqlc.UpdateReviewById(ctx, param)
	return err
}

func (r ReviewsRepository) DeleteReview(id uuid.UUID, userId uuid.UUID) error {
	param := database.DeleteReviewByIdParams{
		ID:     id,
		UserID: userId,
	}
	err := r.sqlc.DeleteReviewById(ctx, param)
	return err
}

func (r ReviewsRepository) CreateComment(userId uuid.UUID, customParam validator.CreateCommentValidator) error {
	reviewId, _ := uuid.Parse(customParam.ReviewId)
	comments := customParam.Comment
	commentJSON, _ := json.Marshal(comments)
	param := database.CreateCommentsParams{
		UserID:   userId,
		ReviewID: reviewId,
		Comment:  commentJSON,
	}
	err := r.sqlc.CreateComments(ctx, param)
	return err
}

func (r ReviewsRepository) GetAllCommentsByReviewId(reviewId uuid.UUID) ([]database.GetAllCommentsByReviewIdRow, error) {
	results, err := r.sqlc.GetAllCommentsByReviewId(ctx, reviewId)
	if err != nil {
		return nil, err
	}
	return results, nil
}

func (r ReviewsRepository) GetCommentById(id uuid.UUID) (*database.Comment, error) {
	result, err := r.sqlc.GetCommentById(ctx, id)
	if err != nil {
		return nil, err
	}
	return &result, nil
}

func (r ReviewsRepository) UpdateComment(comment *database.Comment) error {
	param := database.UpdateCommentParams{
		Comment: comment.Comment,
		ID:      comment.ID,
	}
	err := r.sqlc.UpdateComment(ctx, param)
	return err
}

func (r ReviewsRepository) DeleteComment(id uuid.UUID) error {
	err := r.sqlc.DeleteOrderBill(ctx, id)
	return err
}

func NewReviewsRepository() IReviewsRepository {
	return &ReviewsRepository{
		sqlc: database.New(global.Mdb),
	}
}
