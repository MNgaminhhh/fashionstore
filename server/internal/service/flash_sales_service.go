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

type FlashSaleItemResponse struct {
	ID          uuid.UUID `json:"id"`
	FlashSaleId uuid.UUID `json:"flash_sale_id,omitempty"`
	ProductId   uuid.UUID `json:"product_id,omitempty"`
	Show        bool      `json:"show"`
	ProductName string    `json:"product_name,omitempty"`
	CreatedAt   time.Time `json:"created_at,omitempty"`
	UpdatedAt   time.Time `json:"updated_at,omitempty"`
}

type IFlashSalesService interface {
	CreateFlashSale(startDateStr string, endDateStr string) int
	GetAllFlashSales(filterParam validator.FilterFlashSaleValidator) (int, map[string]interface{})
	GetFlashSaleById(id string) (int, *database.FlashSale)
	DeleteFlashSale(id string) int
	UpdateFlashSale(id string, customParam validator.UpdateFlashSaleValidator) int
	CreateFlashSaleItem(customParam validator.CreateFlashSaleItemValidator) int
	GetAllFlashSaleItemByFlashSaleId(flashSaleIdStr string, filterParam validator.FilterFlashSaleItemValidator) (int, map[string]interface{})
	UpdateFlashSaleItem(id string, customParam validator.UpdateFlashSaleItemValidator) int
	GetFlashSaleItemById(id string) (int, *FlashSaleItemResponse)
	DeleteFlashSaleItem(id string) int
}

type FlashSalesService struct {
	flashSalesRepo repository.IFlashSalesRepository
}

func NewFlashSalesService(repository repository.IFlashSalesRepository) IFlashSalesService {
	return &FlashSalesService{flashSalesRepo: repository}
}

func (fs *FlashSalesService) CreateFlashSale(startDateStr string, endDateStr string) int {
	startDate, pareTimeErr := time.Parse("02-01-2006 15:04", startDateStr)
	if pareTimeErr != nil {
		return response.ErrCodeInvalidDateTimeFormat
	}
	if time.Now().After(startDate) {
		return response.ErrCodeInvalidFlashSaleStartDate
	}
	endDate, pareTimeErr := time.Parse("02-01-2006 15:04", endDateStr)
	if pareTimeErr != nil {
		return response.ErrCodeInvalidDateTimeFormat
	}
	err := fs.flashSalesRepo.CreateFlashSale(startDate, endDate)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr)
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (fs *FlashSalesService) GetAllFlashSales(filterParam validator.FilterFlashSaleValidator) (int, map[string]interface{}) {
	startDate := time.Time{}
	endDate := time.Time{}
	if filterParam.StartDate != nil {
		startDateParse, parseTimeErr := time.Parse("02-01-2006", *filterParam.StartDate)
		if parseTimeErr != nil {
			return response.ErrCodeIncorrectDateFormat, nil
		}
		startDate = startDateParse
	}
	if filterParam.EndDate != nil {
		endDateParse, parseTimeErr := time.Parse("02-01-2006", *filterParam.EndDate)
		if parseTimeErr != nil {
			return response.ErrCodeIncorrectDateFormat, nil
		}
		endDate = endDateParse
	}
	flashSales, flashSalesErr := fs.flashSalesRepo.GetAllFlashSales(startDate, endDate)
	for ind, f := range flashSales {
		log.Println(ind, f)
	}
	if flashSalesErr != nil {
		var pqErr *pq.Error
		if errors.As(flashSalesErr, &pqErr) {
			return pg_error.GetMessageError(pqErr), nil
		}
		return response.ErrCodeInternal, nil
	}
	limit := len(flashSales)
	page := 1
	totalResults := len(flashSales)
	if filterParam.Limit != nil {
		limit = *filterParam.Limit
	}
	if filterParam.Page != nil {
		page = *filterParam.Page
	}
	totalPages := internal.CalculateTotalPages(totalResults, limit)
	pagination := internal.Paginate(flashSales, page, limit)
	resData := map[string]interface{}{
		"totalResults": totalResults,
		"page":         page,
		"limit":        limit,
		"totalPages":   totalPages,
		"flashSales":   pagination,
	}
	return response.SuccessCode, resData
}

func (fs *FlashSalesService) GetFlashSaleById(id string) (int, *database.FlashSale) {
	flashSaleId, _ := uuid.Parse(id)
	flashSale, err := fs.flashSalesRepo.GetFlashSalesById(flashSaleId)
	log.Println(flashSale)
	if err != nil {
		return response.ErrCodeInternal, nil
	}
	return response.SuccessCode, flashSale
}

func (fs *FlashSalesService) DeleteFlashSale(id string) int {
	flashSaleId, _ := uuid.Parse(id)
	err := fs.flashSalesRepo.DeleteFlashSaleById(flashSaleId)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr)
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (fs *FlashSalesService) UpdateFlashSale(id string, customParam validator.UpdateFlashSaleValidator) int {
	flashSaleId, _ := uuid.Parse(id)
	flashSale, err := fs.flashSalesRepo.GetFlashSalesById(flashSaleId)
	if err != nil {
		return response.ErrCodeInternal
	}
	if customParam.StartDate != nil {
		startDate, parseTimeErr := time.Parse("02-01-2006 15:04", *customParam.StartDate)
		if parseTimeErr != nil {
			return response.ErrCodeInvalidDateTimeFormat
		}
		flashSale.StartDate = startDate
	}
	if customParam.EndDate != nil {
		endDate, parseTimeErr := time.Parse("02-01-2006 15:04", *customParam.EndDate)
		if parseTimeErr != nil {
			return response.ErrCodeInvalidDateTimeFormat
		}
		flashSale.EndDate = endDate
	}
	err = fs.flashSalesRepo.UpdateFlashSale(*flashSale)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr)
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (fs *FlashSalesService) CreateFlashSaleItem(customParam validator.CreateFlashSaleItemValidator) int {
	err := fs.flashSalesRepo.CreateFlashSaleItem(customParam)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr)
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (fs *FlashSalesService) GetAllFlashSaleItemByFlashSaleId(flashSaleIdStr string, filterParam validator.FilterFlashSaleItemValidator) (int, map[string]interface{}) {
	flashSaleId, _ := uuid.Parse(flashSaleIdStr)
	flashSaleItems, err := fs.flashSalesRepo.GetAllFlashSaleItemByFlashSaleId(flashSaleId, filterParam)
	if err != nil {
		return response.ErrCodeInternal, nil
	}
	page := 1
	limit := len(flashSaleItems)
	totalResults := len(flashSaleItems)
	if filterParam.Page != nil {
		page = *filterParam.Page
	}
	if filterParam.Limit != nil {
		limit = *filterParam.Limit
	}
	pagination := internal.Paginate(flashSaleItems, page, limit)
	totalPages := internal.CalculateTotalPages(totalResults, limit)
	var results []FlashSaleItemResponse
	for _, flashSaleItem := range pagination {
		responseData := mapToResponseData(&flashSaleItem)
		results = append(results, *responseData)
	}
	resData := map[string]interface{}{
		"limit":          limit,
		"page":           page,
		"totalPages":     totalPages,
		"totalResults":   totalResults,
		"flashSaleItems": results,
	}
	return response.SuccessCode, resData
}

func (fs *FlashSalesService) DeleteFlashSaleItem(id string) int {
	flashSaleItemId, _ := uuid.Parse(id)
	err := fs.flashSalesRepo.DeleteFlashSaleItemById(flashSaleItemId)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr)
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (fs *FlashSalesService) UpdateFlashSaleItem(id string, customParam validator.UpdateFlashSaleItemValidator) int {
	flashSaleItemId, _ := uuid.Parse(id)
	flashSaleItem, err := fs.flashSalesRepo.GetFlashSaleItemById(flashSaleItemId)
	if err != nil {
		return response.ErrCodeNoContent
	}
	if customParam.FlashSaleId != nil {
		flashSaleId, _ := uuid.Parse(*customParam.FlashSaleId)
		flashSaleItem.FlashSalesID = flashSaleId
	}
	if customParam.ProductId != nil {
		productId, _ := uuid.Parse(*customParam.ProductId)
		flashSaleItem.ProductID = productId
	}
	if customParam.Show != nil {
		flashSaleItem.Show.Bool = *customParam.Show
	}
	err = fs.flashSalesRepo.UpdateFlashSaleItem(flashSaleItem)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr)
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (fs *FlashSalesService) GetFlashSaleItemById(id string) (int, *FlashSaleItemResponse) {
	flashSaleItemId, _ := uuid.Parse(id)
	flashSaleItem, err := fs.flashSalesRepo.GetFlashSaleItemById(flashSaleItemId)
	log.Println(flashSaleItem)
	if err != nil {
		return response.ErrCodeInternal, nil
	}
	responseData := mapToResponseData(flashSaleItem)
	return response.SuccessCode, responseData
}

func mapToResponseData[T any](data *T) *FlashSaleItemResponse {
	switch v := any(data).(type) {
	case *database.GetAllFlashSaleItemByFlashSaleIdRow:
		return &FlashSaleItemResponse{
			ID:          v.ID,
			FlashSaleId: v.FlashSalesID,
			ProductId:   v.ProductID,
			Show:        v.Show.Bool,
			ProductName: v.Name.String,
			CreatedAt:   v.CreatedAt.Time,
			UpdatedAt:   v.UpdatedAt.Time,
		}
	case *database.GetFlashSaleItemByIdRow:
		return &FlashSaleItemResponse{
			ID:          v.ID,
			FlashSaleId: v.FlashSalesID,
			ProductId:   v.ProductID,
			Show:        v.Show.Bool,
			ProductName: v.Name.String,
			CreatedAt:   v.CreatedAt.Time,
			UpdatedAt:   v.UpdatedAt.Time,
		}
	default:
		return &FlashSaleItemResponse{}
	}
}
