package service

import (
	"backend/internal"
	"backend/internal/database"
	"backend/internal/pg_error"
	"backend/internal/repository"
	"backend/internal/validator"
	"backend/pkg/response"
	"database/sql"
	"errors"
	"github.com/google/uuid"
	"github.com/lib/pq"
	"log"
)

type FullCatesResponse struct {
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
	Parent    *string                 `json:"parent,omitempty"`
	ParentId  *uuid.UUID              `json:"parentid,omitempty"`
}

type ICategoriesService interface {
	AddNewCategory(customParam validator.AddCategoryRequest) int
	AddSubCate(customParam validator.AddSubCateRequest) int
	AddChildCate(customParam validator.AddChildCateRequest) int
	GetFullCate() (int, []FullCatesResponse)
	GetAllCate(param *validator.FilterCategoryRequest) (int, map[string]interface{})
	GetCateById(id string) (int, *CategoryDataResponse)
	DeleteCateById(id string) int
	UpdateCateById(id string, customParam validator.UpdateCategoryRequest) int
	GetSubCateById(id string) (int, *CategoryDataResponse)
	DeleteSubCateById(id string) int
	UpdateSubCateById(id string, customParam validator.UpdateCategoryRequest) int
	GetAllSubCates(param *validator.FilterCategoryRequest) (int, map[string]interface{})
	GetAllChildCates(customParam validator.FilterCategoryRequest) (int, map[string]interface{})
	GetChildCateById(id string) (int, *CategoryDataResponse)
	DeleteChildCateById(id string) int
	UpdateChildCateById(id string, customParam validator.UpdateCategoryRequest) int
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
			return pg_error.GetMessageError(pqError)
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
			return pg_error.GetMessageError(pqError)
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
			return pg_error.GetMessageError(pqError)
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (cs *CategoriesService) GetFullCate() (int, []FullCatesResponse) {
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
		"total_pages":   totalPages,
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
		var pqError *pq.Error
		if errors.As(err, &pqError) {
			return pg_error.GetMessageError(pqError)
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (cs *CategoriesService) GetAllSubCates(param *validator.FilterCategoryRequest) (int, map[string]interface{}) {
	subCates, err := cs.cateRepo.GetAllSubCategories(param)
	if err != nil {
		return response.ErrCodeInternal, nil
	}
	limit := len(subCates)
	page := 1
	if param.Limit != nil {
		limit = *param.Limit
	}
	if param.Page != nil {
		page = *param.Page
	}
	totalPages := internal.CalculateTotalPages(len(subCates), limit)
	subCates = internal.Paginate(subCates, page, limit)
	var subCatesResponse []CategoryDataResponse
	for _, sub := range subCates {
		data := mapCategoryToResponse(sub)
		subCatesResponse = append(subCatesResponse, data)
	}
	results := map[string]interface{}{
		"sub_categories": subCatesResponse,
		"page":           page,
		"limit":          limit,
		"total-results":  len(subCates),
		"total_pages":    totalPages,
	}
	return response.SuccessCode, results
}

func (cs *CategoriesService) GetSubCateById(id string) (int, *CategoryDataResponse) {
	subCateId, _ := uuid.Parse(id)
	subCate, err := cs.cateRepo.GetSubCategoryById(subCateId)
	if err != nil {
		return response.ErrCodeCateNotFound, nil
	}
	result := mapCategoryToResponse(subCate)
	return response.SuccessCode, &result
}

func (cs *CategoriesService) DeleteSubCateById(id string) int {
	subCateId, _ := uuid.Parse(id)
	err := cs.cateRepo.DeleteSubCategoryById(subCateId)
	if err != nil {
		return response.ErrCodeCateNotFound
	}
	return response.SuccessCode
}

func (cs *CategoriesService) UpdateSubCateById(id string, customParam validator.UpdateCategoryRequest) int {
	subCateId, _ := uuid.Parse(id)
	newSubCate, err := cs.cateRepo.GetSubCategoryById(subCateId)
	if err != nil {
		return response.ErrCodeCateNotFound
	}
	if customParam.Name != nil {
		newSubCate.Name = *customParam.Name
	}
	if customParam.NameCode != nil {
		newSubCate.NameCode = *customParam.NameCode
	}
	if customParam.Parent != nil {
		cateId, _ := uuid.Parse(*customParam.Parent)
		newSubCate.CategoryID = cateId
	}
	if customParam.Status != nil {
		newSubCate.Status = sql.NullInt32{Int32: int32(*customParam.Status), Valid: true}
	}
	if customParam.Component != nil {
		newSubCate.Component = database.NullComponentsType{
			ComponentsType: database.ComponentsType(*customParam.Component),
			Valid:          true,
		}
	}
	err = cs.cateRepo.UpdateSubCategoryById(newSubCate)
	if err != nil {
		var pqError *pq.Error
		if errors.As(err, &pqError) {
			return pg_error.GetMessageError(pqError)
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func mapResponseTreeData(rows []database.GetFullCategoriesRow) []FullCatesResponse {
	var results []FullCatesResponse
	if rows != nil {
		categories := make(map[string]FullCatesResponse)

		for _, row := range rows {
			cateID := row.CategoryID.String()

			if _, exists := categories[cateID]; !exists {
				categories[cateID] = FullCatesResponse{
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

func (cs *CategoriesService) GetAllChildCates(customParam validator.FilterCategoryRequest) (int, map[string]interface{}) {
	childCates, err := cs.cateRepo.GetAllChildCategories(customParam)
	if err != nil {
		return response.ErrCodeInternal, nil
	}
	limit := len(childCates)
	if customParam.Limit != nil {
		limit = *customParam.Limit
	}
	page := 1
	if customParam.Page != nil {
		page = *customParam.Page
	}
	totalResults := len(childCates)
	totalPages := internal.CalculateTotalPages(len(childCates), limit)
	childCates = internal.Paginate(childCates, page, limit)
	var childResponse []CategoryDataResponse
	for _, childCate := range childCates {
		data := mapCategoryToResponse(childCate)
		childResponse = append(childResponse, data)
	}
	result := map[string]interface{}{
		"total_pages":      totalPages,
		"page":             page,
		"total-results":    totalResults,
		"child_categories": childResponse,
	}
	return response.SuccessCode, result
}

func (cs *CategoriesService) GetChildCateById(id string) (int, *CategoryDataResponse) {
	childCateId, _ := uuid.Parse(id)
	childCate, err := cs.cateRepo.GetChildCateById(childCateId)
	if err != nil {
		return response.ErrCodeCateNotFound, nil
	}
	result := mapCategoryToResponse(childCate)
	return response.SuccessCode, &result
}

func (cs *CategoriesService) DeleteChildCateById(id string) int {
	childCateId, _ := uuid.Parse(id)
	err := cs.cateRepo.DeleteChildCateById(childCateId)
	if err != nil {
		return response.ErrCodeCateNotFound
	}
	return response.SuccessCode
}

func (cs *CategoriesService) UpdateChildCateById(id string, customParam validator.UpdateCategoryRequest) int {
	childCateId, _ := uuid.Parse(id)
	newChildCate, err := cs.cateRepo.GetChildCateById(childCateId)
	if err != nil {
		return response.ErrCodeCateNotFound
	}
	if customParam.Name != nil {
		newChildCate.Name = *customParam.Name
	}
	if customParam.NameCode != nil {
		newChildCate.NameCode = *customParam.NameCode
	}
	if customParam.Parent != nil {
		subCateId, _ := uuid.Parse(*customParam.Parent)
		newChildCate.SubCategoryID = uuid.NullUUID{
			UUID:  subCateId,
			Valid: true,
		}
	}
	if customParam.Status != nil {
		newChildCate.Status = sql.NullInt32{Int32: int32(*customParam.Status), Valid: true}
	}
	err = cs.cateRepo.UpdateChildCateById(newChildCate)
	if err != nil {
		var pqError *pq.Error
		if errors.As(err, &pqError) {
			return pg_error.GetMessageError(pqError)
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func mapCategoryToResponse[T any](category T) CategoryDataResponse {
	switch v := any(category).(type) {
	case *database.Category:
		return CategoryDataResponse{
			ID:        v.ID.String(),
			Name:      v.Name,
			NameCode:  v.NameCode,
			Url:       v.Url.String,
			Icon:      v.Icon.String,
			Status:    int(v.Status.Int32),
			Component: v.Component.ComponentsType,
		}
	case database.FindALlSubCategoriesRow:
		return CategoryDataResponse{
			ID:        v.ID.String(),
			Name:      v.Name,
			NameCode:  v.NameCode,
			Url:       v.Url.String,
			Status:    int(v.Status.Int32),
			Component: v.Component.ComponentsType,
			Parent:    &v.CategoryName,
		}
	case *database.FindSubCategoryByIdRow:
		return CategoryDataResponse{
			ID:        v.ID.String(),
			Name:      v.Name,
			NameCode:  v.NameCode,
			Url:       v.Url.String,
			Status:    int(v.Status.Int32),
			Component: v.Component.ComponentsType,
			Parent:    &v.CategoryName,
		}
	case database.FindAllChildCategoriesRow:
		return CategoryDataResponse{
			ID:       v.ID.String(),
			Name:     v.Name,
			NameCode: v.NameCode,
			Url:      v.Url.String,
			Status:   int(v.Status.Int32),
			Parent:   &v.SubCategoryName,
		}
	case *database.FindChildCategoryByIdRow:
		return CategoryDataResponse{
			ID:       v.ID.String(),
			Name:     v.Name,
			NameCode: v.NameCode,
			Url:      v.Url.String,
			Status:   int(v.Status.Int32),
			Parent:   &v.SubCategoryName,
			ParentId: &v.SubCategoryID_2,
		}

	default:
		return CategoryDataResponse{}
	}
}
