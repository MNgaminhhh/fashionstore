package service

import (
	"backend/internal/repository"
	"backend/internal/validator"
	"backend/pkg/response"
	"errors"
	"github.com/lib/pq"
)

type ICategoriesService interface {
	AddNewCategory(customParam validator.AddCategoryRequest) int
	AddSubCate(customParam validator.AddSubCateRequest) int
}

type CategoriesService struct {
	cateRepo repository.ICategoryRepository
}

func NewCategoriesService(cateRepo repository.ICategoryRepository) ICategoriesService {
	return &CategoriesService{cateRepo: cateRepo}
}

func (cs *CategoriesService) AddNewCategory(customParam validator.AddCategoryRequest) int {
	err := cs.cateRepo.AddNewCategory(customParam)
	if err != nil {
		var pqError *pq.Error
		if errors.As(err, &pqError) {
			if pqError.Code == "23505" {
				if pqError.Constraint == "categories_name_code_key" {
					return response.ErrCodeNameCodeAlreadyUsed
				} else if pqError.Constraint == "categories_name_key" {
					return response.ErrCodeNameAlreadyUsed
				}
			}
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (cs *CategoriesService) AddSubCate(customParam validator.AddSubCateRequest) int {
	err := cs.cateRepo.AddNewSubCategory(customParam)
	if err != nil {
		var pqError *pq.Error
		if errors.As(err, &pqError) {
			if pqError.Code == "23505" {
				if pqError.Constraint == "unique_sub_name_per_category" {
					return response.ErrCodeNameAlreadyUsed
				}
				if pqError.Constraint == "unique_sub_name_code_per_category" {
					return response.ErrCodeNameCodeAlreadyUsed
				}
			}
			if pqError.Code == "23502" {
				return response.ErrCodeCateNotFound
			}
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}
