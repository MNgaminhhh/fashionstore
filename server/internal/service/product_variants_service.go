package service

import (
	"backend/internal"
	"backend/internal/database"
	"backend/internal/pg_error"
	"backend/internal/repository"
	"backend/internal/validator"
	"backend/pkg/response"
	"errors"
	"github.com/google/uuid"
	"github.com/lib/pq"
	"log"
	"time"
)

type ProductVariantResponse struct {
	ID        string    `json:"id,omitempty"`
	Name      string    `json:"name,omitempty"`
	Status    string    `json:"status,omitempty"`
	CreatedAt time.Time `json:"created_at,omitempty"`
	UpdatedAt time.Time `json:"updated_at,omitempty"`
}

type VariantOptionResponse struct {
	ID                 string    `json:"id,omitempty"`
	Name               string    `json:"name,omitempty"`
	Status             string    `json:"status,omitempty"`
	ProductVariantName string    `json:"product_variant_name,omitempty"`
	CreatedAt          time.Time `json:"created_at,omitempty"`
	UpdatedAt          time.Time `json:"updated_at,omitempty"`
}

type IProductVariantsService interface {
	CreateProductVariant(customParam validator.CreateProductVariantValidator) int
	GetAllProductVariants(filterParam validator.FilterProductVariantValidator) (int, map[string]interface{})
	DeleteProductVariants(id string) int
	UpdateProductVariants(id string, customParam validator.UpdateProductVariantValidator) int
	GetProductVariantById(id string) (int, *ProductVariantResponse)
	CreateVariantOption(customParam validator.CreateVariantOptionValidator) int
	GetListVariantOptionsByPvId(pvId string, customParam validator.FilterVariantOptionValidator) (int, map[string]interface{})
	UpdateVariantOptionsById(id string, customParam validator.UpdateVariantOptionValidator) int
	DeleteVariantOptionById(id string) int
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
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr)
		}
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
	return response.SuccessCode, MapProductVariantToResponse(pv)
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
		pagination = append(pagination, *MapProductVariantToResponse(&pv))
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

func (ps *ProductVariantsService) CreateVariantOption(customParam validator.CreateVariantOptionValidator) int {
	err := ps.pVarRepo.CreateVariantOption(customParam)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr)
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (ps *ProductVariantsService) GetListVariantOptionsByPvId(pvId string, customParam validator.FilterVariantOptionValidator) (int, map[string]interface{}) {
	id, _ := uuid.Parse(pvId)
	variantOptions, err := ps.pVarRepo.GetListVariantOptionsByPvId(id, customParam)
	totalResults := len(variantOptions)
	limit := 10
	page := 1
	if customParam.Limit != nil {
		limit = *customParam.Limit
	}
	if customParam.Page != nil {
		page = *customParam.Page
	}
	totalPage := internal.CalculateTotalPages(totalResults, limit)
	pagination := internal.Paginate(variantOptions, page, limit)
	var responseData []VariantOptionResponse
	for _, vo := range pagination {
		responseData = append(responseData, *MapVariantOptionToResponse(&vo))
	}
	results := map[string]interface{}{
		"results":   responseData,
		"page":      page,
		"limit":     limit,
		"total":     totalResults,
		"totalPage": totalPage,
	}
	if err != nil {
		return response.ErrCodeInternal, nil
	}
	return response.SuccessCode, results
}

func (ps *ProductVariantsService) UpdateVariantOptionsById(id string, customParam validator.UpdateVariantOptionValidator) int {
	voId, _ := uuid.Parse(id)
	variantOption, err := ps.pVarRepo.GetVariantOptionById(voId)
	if err != nil {
		log.Println(err)
		return response.ErrCodeProductVariantNotFound
	}
	if customParam.Name != nil {
		variantOption.Name = *customParam.Name
	}
	if customParam.Status != nil {
		variantOption.Status = database.NullVariantsStatus{
			Valid:          true,
			VariantsStatus: database.VariantsStatus(*customParam.Status),
		}
	}
	if customParam.ProductVariant != nil {
		pvId, _ := uuid.Parse(*customParam.ProductVariant)
		variantOption.ProductVariantID = pvId
	}
	err = ps.pVarRepo.UpdateVariantOptionById(variantOption)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return response.ErrCodeProductVariantNotFound
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (ps *ProductVariantsService) DeleteVariantOptionById(id string) int {
	voId, _ := uuid.Parse(id)
	err := ps.pVarRepo.DeleteVariantOptionById(voId)
	if err != nil {
		var pgErr *pq.Error
		if errors.As(err, &pgErr) {
			return response.ErrCodeProductVariantNotFound
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func MapProductVariantToResponse(pv *database.ProductVariant) *ProductVariantResponse {
	return &ProductVariantResponse{
		ID:        pv.ID.String(),
		Name:      pv.Name,
		Status:    string(pv.Status.VariantsStatus),
		CreatedAt: pv.CreatedAt.Time,
		UpdatedAt: pv.UpdatedAt.Time,
	}
}

func MapVariantOptionToResponse(vo *database.GetAllVariantOptionsByPvIdRow) *VariantOptionResponse {
	return &VariantOptionResponse{
		ID:                 vo.ID.UUID.String(),
		Name:               vo.Name.String,
		Status:             string(vo.Status.VariantsStatus),
		ProductVariantName: vo.ProductVariantName,
		CreatedAt:          vo.CreatedAt.Time,
		UpdatedAt:          vo.UpdatedAt.Time,
	}
}
