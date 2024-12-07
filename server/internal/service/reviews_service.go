package service

import (
	"backend/internal/pg_error"
	"backend/internal/repository"
	"backend/internal/validator"
	"backend/pkg/response"
	"encoding/json"
	"errors"
	"github.com/google/uuid"
	"github.com/lib/pq"
	"math"
)

type IReviewsService interface {
	UserReviewProduct(userId string, customParam validator.CreateReviewValidator) int
	UpdateReview(userId string, id string, customParam validator.UpdateReviewValidator) int
	DeleteReview(id string, userId string) int
}

type ReviewsService struct {
	reviewsRepo repository.IReviewsRepository
}

func (r ReviewsService) UserReviewProduct(userId string, customParam validator.CreateReviewValidator) int {
	if checkRatingPoint(customParam.Rating) == false {
		return response.ErrCodeInvalidRatingPoint
	}
	userUUID, _ := uuid.Parse(userId)
	err := r.reviewsRepo.CreateReview(userUUID, customParam)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr)
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (r ReviewsService) UpdateReview(userId string, id string, customParam validator.UpdateReviewValidator) int {
	reviewId, _ := uuid.Parse(id)
	review, findErr := r.reviewsRepo.GetReviewById(reviewId)
	if findErr != nil {
		return response.ErrCodeNoContent
	}
	userUUID, _ := uuid.Parse(userId)
	if review.UserID != userUUID {
		return response.ErrCodeNoPermissionReview
	}
	if customParam.Comment != nil {
		comment := customParam.Comment
		commentJSON, _ := json.Marshal(comment)
		review.Comment = commentJSON
	}
	if customParam.Rating != nil {
		if checkRatingPoint(*customParam.Rating) == false {
			return response.ErrCodeInvalidRatingPoint
		}
		review.Rating = *customParam.Rating
	}
	err := r.reviewsRepo.UpdateReview(review)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr)
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (r ReviewsService) DeleteReview(id string, userId string) int {
	reviewId, _ := uuid.Parse(id)
	userUUID, _ := uuid.Parse(userId)
	err := r.reviewsRepo.DeleteReview(reviewId, userUUID)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr)
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func checkRatingPoint(rating float64) bool {
	if rating > 0 && rating <= 5 && math.Mod(rating, 0.5) == 0 {
		return true
	}
	return false
}

func NewReviewsService(reviewsRepo repository.IReviewsRepository) IReviewsService {
	return &ReviewsService{
		reviewsRepo: reviewsRepo,
	}
}
