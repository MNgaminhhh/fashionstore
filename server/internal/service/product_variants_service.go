package service

import (
	"backend/internal"
	"backend/internal/database"
	"backend/internal/repository"
	"backend/internal/validator"
	"backend/pkg/response"
	"github.com/google/uuid"
	"log"
	"time"
)

type ProductVariantResponse struct {
	Name      string    `json:"name,omitempty"`
	Status    string    `json:"status,omitempty"`
	CreatedAt time.Time `json:"created_at,omitempty"`
	UpdatedAt time.Time `json:"updated_at,omitempty"`
}

type IProductVariantsService interface {
	CreateProductVariant(customParam validator.CreateProductVariantValidator) int
	GetAllProductVariants(filterParam validator.FilterProductVariantValidator) (int, map[string]interface{})
	DeleteProductVariants(id string) int
	UpdateProductVariants(id string, customParam validator.UpdateProductVariantValidator) int
	GetProductVariantById(id string) (int, *ProductVariantResponse)
}

type ProductVariantsService struct {
	pVarRepo repository.IProductVariantsRepository
}

func NewProductVariantsService(pVarRepo repository.IProductVariantsRepository) IProductVariantsService {
	return &ProductVariantsService{pVarRepo: pVarRepo}
}

func (ps *ProductVariantsService) CreateProductVariant(customParam validator.CreateProductVariantValidator) int {
	err := ps.pVarRepo.CreateProductVariant(customParam)
	if err != nil {
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (ps *ProductVariantsService) DeleteProductVariants(id string) int {
	pvId, _ := uuid.Parse(id)
	err := ps.pVarRepo.DeleteProductVariantById(pvId)
	if err != nil {
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (ps *ProductVariantsService) UpdateProductVariants(id string, customParam validator.UpdateProductVariantValidator) int {
	pvId, _ := uuid.Parse(id)
	pv, err := ps.pVarRepo.GetProductVariantById(pvId)
	if err != nil {
		return response.ErrCodeInternal
	}
	if pv == nil {
		return response.ErrCodeProductVariantNotFound
	}
	if customParam.Name != nil {
		pv.Name = *customParam.Name
	}
	if customParam.Status != nil {
		pv.Status = database.NullVariantsStatus{
			Valid:          true,
			VariantsStatus: database.VariantsStatus(*customParam.Status),
		}
	}
	err = ps.pVarRepo.UpdateProductVariant(pv)
	if err != nil {
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (ps *ProductVariantsService) GetProductVariantById(id string) (int, *ProductVariantResponse) {
	pvId, _ := uuid.Parse(id)
	pv, err := ps.pVarRepo.GetProductVariantById(pvId)
	if err != nil {
		return response.ErrCodeProductVariantNotFound, nil
	}
	return response.SuccessCode, MapToResponse(pv)
}

func (ps *ProductVariantsService) GetAllProductVariants(filterParam validator.FilterProductVariantValidator) (int, map[string]interface{}) {
	name := filterParam.Name
	pPage := filterParam.Page
	pLimit := filterParam.Limit
	status := filterParam.Status
	pVariants, err := ps.pVarRepo.GetListProductVariants(name, status)
	if err != nil {
		log.Println(err)
		return response.ErrCodeInternal, nil
	}
	page := 1
	limit := len(pVariants)
	if pPage != nil {
		page = *pPage
	}
	if pLimit != nil {
		limit = *pLimit
	}
	totalResults := len(pVariants)
	totalPage := internal.CalculateTotalPages(len(pVariants), limit)
	pVariants = internal.Paginate(pVariants, page, limit)
	var pagination []ProductVariantResponse
	for _, pv := range pVariants {
		pagination = append(pagination, *MapToResponse(&pv))
	}
	results := map[string]interface{}{
		"productVariants": pagination,
		"page":            page,
		"limit":           limit,
		"totalPage":       totalPage,
		"total":           totalResults,
	}
	return response.SuccessCode, results
}

func MapToResponse(pv *database.ProductVariant) *ProductVariantResponse {
	return &ProductVariantResponse{
		Name:      pv.Name,
		Status:    string(pv.Status.VariantsStatus),
		CreatedAt: pv.CreatedAt.Time,
		UpdatedAt: pv.UpdatedAt.Time,
	}
}
