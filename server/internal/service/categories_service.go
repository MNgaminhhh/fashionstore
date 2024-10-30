package service

import (
	"backend/internal/database"
	"backend/internal/repository"
	"backend/internal/validator"
	"backend/pkg/response"
	"errors"
	"github.com/lib/pq"
	"log"
)

type CateResponse struct {
	Icon      string                  `json:"icon"`
	Title     string                  `json:"title"`
	Href      string                  `json:"href"`
	Component database.ComponentsType `json:"component"`
	Children  []ChildItem             `json:"children,omitempty"`
}

type ChildItem struct {
	Title    string      `json:"title"`
	Href     string      `json:"href"`
	Children []ChildItem `json:"children,omitempty"`
}

type ICategoriesService interface {
	AddNewCategory(customParam validator.AddCategoryRequest) int
	AddSubCate(customParam validator.AddSubCateRequest) int
	AddChildCate(customParam validator.AddChildCateRequest) int
	GetFullCate() (int, []CateResponse)
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

func (cs *CategoriesService) AddChildCate(customParam validator.AddChildCateRequest) int {
	err := cs.cateRepo.AddChildCate(customParam)
	if err != nil {
		var pqError *pq.Error
		if errors.As(err, &pqError) {
			log.Println(pqError.Code)
			if pqError.Code == "23505" {
				if pqError.Constraint == "unique_child_name_per_sub_cate" {
					return response.ErrCodeNameAlreadyUsed
				}
				if pqError.Constraint == "unique_child_name_code_per_sub_cate" {
					return response.ErrCodeNameCodeAlreadyUsed
				}
			}
			if pqError.Code == "23503" {
				return response.ErrCodeSubCateNotFound
			}
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (cs *CategoriesService) GetFullCate() (int, []CateResponse) {
	rows, err := cs.cateRepo.GetFullCate()
	if err != nil {
		return response.ErrCodeInternal, nil
	}
	data := mapResponseTreeData(rows)
	return response.SuccessCode, data
}

func mapResponseTreeData(rows []database.GetFullCategoriesRow) []CateResponse {
	var results []CateResponse
	if rows != nil {
		categories := make(map[string]CateResponse)

		for _, row := range rows {
			cateID := row.CategoryID.String()

			if _, exists := categories[cateID]; !exists {
				categories[cateID] = CateResponse{
					Icon:      row.CategoryIcon.String,
					Title:     row.CategoryName,
					Href:      row.CategoryUrl.String,
					Component: row.CategoryComponent.ComponentsType,
					Children:  []ChildItem{},
				}
			}

			category := categories[cateID]

			if row.SubCategoryName.String != "" {
				subCategory := ChildItem{
					Title:    row.SubCategoryName.String,
					Href:     row.SubCategoryUrl.String,
					Children: []ChildItem{},
				}

				foundSubCategory := false
				for i, child := range category.Children {
					if child.Title == subCategory.Title && child.Href == subCategory.Href {
						if row.ChildCategoryName.String != "" {
							child.Children = append(child.Children, ChildItem{
								Title:    row.ChildCategoryName.String,
								Href:     row.ChildCategoryUrl.String,
								Children: nil,
							})
						}

						category.Children[i] = child
						foundSubCategory = true
						break
					}
				}

				if !foundSubCategory {
					if row.ChildCategoryName.String != "" {
						subCategory.Children = append(subCategory.Children, ChildItem{
							Title:    row.ChildCategoryName.String,
							Href:     row.ChildCategoryUrl.String,
							Children: nil,
						})
					}

					category.Children = append(category.Children, subCategory)
				}
			}

			categories[cateID] = category
		}
		for _, category := range categories {
			results = append(results, category)
		}
	}
	return results
}
