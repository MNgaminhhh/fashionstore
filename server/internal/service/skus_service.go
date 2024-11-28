package service

import (
	"backend/internal"
	"backend/internal/database"
	"backend/internal/pg_error"
	"backend/internal/repository"
	"backend/internal/validator"
	"backend/pkg/response"
	"encoding/json"
	"errors"
	"github.com/google/uuid"
	"github.com/lib/pq"
	"log"
)

type SkuResponse struct {
	ProductName string          `json:"product_name,omitempty"`
	ProductId   string          `json:"product_id,omitempty"`
	Sku         string          `json:"sku,omitempty"`
	Price       int             `json:"price,omitempty"`
	Variants    json.RawMessage `json:"variants,omitempty"`
	InStock     int             `json:"in_stock,omitempty"`
}

type ISkusService interface {
	CreateSku(customParam validator.CreateSkuValidator) int
	GetAllSkusOfVendor(id string, filterParam validator.FilterSkuValidator) (int, map[string]interface{})
}

type SkusService struct {
	skusRepo repository.ISkusRepository
}

func NewSkusService(skusRepo repository.ISkusRepository) ISkusService {
	return &SkusService{
		skusRepo: skusRepo,
	}
}

func (sv *SkusService) CreateSku(customParam validator.CreateSkuValidator) int {
	err := sv.skusRepo.CreateSku(customParam)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr)
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (sv *SkusService) GetAllSkusOfVendor(id string, filterParam validator.FilterSkuValidator) (int, map[string]interface{}) {
	vendorId, _ := uuid.Parse(id)
	skus, err := sv.skusRepo.GetAllSkusByVendorId(vendorId, filterParam)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return response.ErrCodeDatabase, nil
		}
	}
	limit := len(skus)
	page := 1
	if filterParam.Page != nil {
		page = *filterParam.Page
	}
	if filterParam.Limit != nil {
		limit = *filterParam.Limit
	}
	totalResults := len(skus)
	pagination := internal.Paginate(skus, page, limit)
	totalPages := internal.CalculateTotalPages(totalResults, page)
	var allResponseData []SkuResponse
	for _, sku := range pagination {
		resData, _ := mapResponseData(&sku)
		if resData != nil {
			allResponseData = append(allResponseData, *resData)
		}
	}
	results := map[string]interface{}{
		"totalPage": totalPages,
		"total":     totalResults,
		"data":      allResponseData,
		"page":      page,
		"limit":     limit,
	}
	return response.SuccessCode, results
}

func mapResponseData[T any](data *T) (*SkuResponse, error) {
	switch s := any(data).(type) {
	case *database.GetAllSkuOfVendorRow:
		return &SkuResponse{
			ProductName: s.ProductName,
			ProductId:   "",
			Sku:         s.Sku.String,
			Price:       int(s.Price.Int64),
			Variants:    s.VariantOptions,
			InStock:     int(s.InStock.Int16),
		}, nil
	default:
		log.Println("Unhandled data type:", data)
		return nil, nil
	}
}
