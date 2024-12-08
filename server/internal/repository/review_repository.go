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

func NewReviewsRepository() IReviewsRepository {
	return &ReviewsRepository{
		sqlc: database.New(global.Mdb),
	}
}
