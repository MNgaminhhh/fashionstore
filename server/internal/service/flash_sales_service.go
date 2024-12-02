package service

import (
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

type IFlashSalesService interface {
	CreateFlashSale(startDateStr string, endDateStr string) int
	GetAllFlashSales(filterParam validator.FilterFlashSaleValidator) (int, []database.FlashSale)
	GetFlashSaleById(id string) (int, *database.FlashSale)
	DeleteFlashSale(id string) int
	UpdateFlashSale(id string, customParam validator.UpdateFlashSaleValidator) int
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

func (fs *FlashSalesService) GetAllFlashSales(filterParam validator.FilterFlashSaleValidator) (int, []database.FlashSale) {
	startDate := time.Time{}
	endDate := time.Time{}
	if filterParam.StartDate != nil {
		startDateParse, parseTimeErr := time.Parse("02-01-2006", *filterParam.StartDate)
		if parseTimeErr != nil {
			return response.ErrCodeIncorrectDateFormat, make([]database.FlashSale, 0)
		}
		startDate = startDateParse
	}
	if filterParam.EndDate != nil {
		endDateParse, parseTimeErr := time.Parse("02-01-2006", *filterParam.EndDate)
		if parseTimeErr != nil {
			return response.ErrCodeIncorrectDateFormat, make([]database.FlashSale, 0)
		}
		endDate = endDateParse
	}
	results, flashSalesErr := fs.flashSalesRepo.GetAllFlashSales(startDate, endDate)
	if flashSalesErr != nil {
		return response.ErrCodeInternal, nil
	}
	return response.SuccessCode, results
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
