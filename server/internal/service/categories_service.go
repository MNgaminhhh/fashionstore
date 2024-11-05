package service

import (
	"backend/internal"
	"backend/internal/database"
	"backend/internal/repository"
	"backend/internal/validator"
	"backend/pkg/response"
	"database/sql"
	"errors"
	"github.com/google/uuid"
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

type CategoryDataResponse struct {
	ID        string                  `json:"id"`
	Name      string                  `json:"name"`
	NameCode  string                  `json:"nameCode"`
	Url       string                  `json:"url,omitempty"`
	Icon      string                  `json:"icon,omitempty"`
	Status    int                     `json:"status"`
	Component database.ComponentsType `json:"component,omitempty"`
}

type ICategoriesService interface {
	AddNewCategory(customParam validator.AddCategoryRequest) int
	AddSubCate(customParam validator.AddSubCateRequest) int
	AddChildCate(customParam validator.AddChildCateRequest) int
	GetFullCate() (int, []CateResponse)
	GetAllCate(param *validator.FilterCategoryRequest) (int, map[string]interface{})
	GetCateById(id string) (int, *CategoryDataResponse)
	DeleteCateById(id string) int
	UpdateCateById(id string, customParam validator.UpdateCategoryRequest) int
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

func (cs *CategoriesService) GetAllCate(param *validator.FilterCategoryRequest) (int, map[string]interface{}) {
	cates, err := cs.cateRepo.GetAllCategories(param)
	limit := len(cates)
	page := 1
	if param.Limit != nil {
		limit = *param.Limit
	}
	if param.Page != nil {
		page = *param.Page
	}
	totalPages := internal.CalculateTotalPages(len(cates), limit)
	cates = internal.Paginate(cates, page, limit)
	var responseData []CategoryDataResponse
	for _, data := range cates {
		responseData = append(responseData, mapCategoryToResponse(&data))
	}
	results := map[string]interface{}{
		"categories":    responseData,
		"page":          page,
		"limit":         limit,
		"total-results": len(responseData),
		"total-pages":   totalPages,
	}
	if err != nil {
		return response.ErrCodeInternal, nil
	}
	return response.SuccessCode, results
}

func (cs *CategoriesService) GetCateById(id string) (int, *CategoryDataResponse) {
	cateId, _ := uuid.Parse(id)
	cate, err := cs.cateRepo.GetCategoryById(cateId)
	if err != nil {
		return response.ErrCodeCateNotFound, nil
	}
	result := mapCategoryToResponse(cate)
	return response.SuccessCode, &result
}

func (cs *CategoriesService) DeleteCateById(id string) int {
	cateId, _ := uuid.Parse(id)
	log.Println(cateId)
	err := cs.cateRepo.DeleteCategoryById(cateId)
	if err != nil {
		log.Println(err.Error())
		return response.ErrCodeCateNotFound
	}
	return response.SuccessCode
}

func (cs *CategoriesService) UpdateCateById(id string, customParam validator.UpdateCategoryRequest) int {
	cateId, _ := uuid.Parse(id)
	newCate, err := cs.cateRepo.GetCategoryById(cateId)
	if err != nil {
		return response.ErrCodeCateNotFound
	}
	if customParam.Name != nil {
		newCate.Name = *customParam.Name
	}
	if customParam.NameCode != nil {
		newCate.NameCode = *customParam.NameCode
	}
	if customParam.Icon != nil {
		newCate.Icon = sql.NullString{String: *customParam.Icon, Valid: true}
	}
	if customParam.Status != nil {
		newCate.Status = sql.NullInt32{Int32: int32(*customParam.Status), Valid: true}
	}
	if customParam.Component != nil {
		newCate.Component = database.NullComponentsType{
			ComponentsType: database.ComponentsType(*customParam.Component),
			Valid:          true,
		}
	}
	err = cs.cateRepo.UpdateCategoryById(newCate)
	if err != nil {
		return response.ErrCodeInternal
	}
	return response.SuccessCode
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

func mapCategoryToResponse(category *database.Category) CategoryDataResponse {
	return CategoryDataResponse{
		ID:        category.ID.String(),
		Name:      category.Name,
		NameCode:  category.NameCode,
		Url:       category.Url.String,
		Icon:      category.Icon.String,
		Status:    int(category.Status.Int32),
		Component: category.Component.ComponentsType,
	}
}
