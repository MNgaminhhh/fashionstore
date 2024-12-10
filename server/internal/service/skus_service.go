package service

import (
	"backend/internal"
	"backend/internal/database"
	"backend/internal/pg_error"
	"backend/internal/repository"
	"backend/internal/validator"
	"backend/pkg/response"
	"database/sql"
	"encoding/json"
	"errors"
	"github.com/google/uuid"
	"github.com/lib/pq"
	"log"
	"time"
)

type SkuResponse struct {
	Id             string          `json:"id"`
	ProductName    string          `json:"product_name,omitempty"`
	ProductId      string          `json:"product_id,omitempty"`
	Sku            string          `json:"sku,omitempty"`
	Price          int             `json:"price,omitempty"`
	OfferPrice     int             `json:"offer_price,omitempty"`
	Offer          int             `json:"offer"`
	OfferStartDate string          `json:"offer_start_date,omitempty"`
	OfferEndDate   string          `json:"offer_end_date,omitempty"`
	Variants       json.RawMessage `json:"variants,omitempty"`
	InStock        int             `json:"in_stock,omitempty"`
	Status         string          `json:"status"`
}

type ISkusService interface {
	CreateSku(customParam validator.CreateSkuValidator) int
	GetAllSkusOfVendor(id string, filterParam validator.FilterSkuValidator) (int, map[string]interface{})
	UpdateSku(id string, customParam validator.UpdateSkuValidator) int
	DeleteSkuById(id string) int
	GetSkuById(id string) (int, *SkuResponse)
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
	newSkuId := uuid.New()
	var startDate time.Time
	var endDate time.Time
	if customParam.Offer != 0 {
		if customParam.OfferStartDate == nil || customParam.OfferEndDate == nil {
			return response.ErrCodeDateIsRequired
		}
	}
	if customParam.OfferStartDate != nil {
		var parseErr error
		startDate, parseErr = time.Parse("02-01-2006 15:04", *customParam.OfferStartDate)
		if parseErr != nil {
			return response.ErrCodeInvalidDateTimeFormat
		}
		if time.Now().After(startDate) {
			return response.ErrCodeInvalidFlashSaleStartDate
		}
		if customParam.OfferEndDate == nil {
			return response.ErrCodeEndDateEmpty
		}
		endDate, parseErr = time.Parse("02-01-2006 15:04", *customParam.OfferEndDate)
		if parseErr != nil {
			return response.ErrCodeInvalidDateTimeFormat
		}
	}
	err := sv.skusRepo.CreateSku(newSkuId, customParam, &startDate, &endDate)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr)
		}
		return response.ErrCodeInternal
	}
	variantOptions := customParam.VariantOptions
	skusVariantOptionsRepo := repository.NewSkusVariantOptionsRepository()
	check, checkErr := skusVariantOptionsRepo.CheckExistVariantOptions(customParam.VariantOptions)
	if checkErr != nil {
		log.Println(checkErr)
		return response.ErrCodeInternal
	}
	log.Println(*check)
	if *check == true {
		_ = sv.skusRepo.DeleteSkuById(newSkuId)
		return response.ErrCodeCombinationOptionsIsExists
	}
	for _, vo := range variantOptions {
		addSkusVariantsParam := validator.CreateSkuVariantOptionValidator{
			SkuId:           newSkuId.String(),
			VariantOptionId: vo.String(),
		}
		addSkusVariantOptionsErr := skusVariantOptionsRepo.CreateSkusVariantOptions(addSkusVariantsParam)
		if addSkusVariantOptionsErr != nil {
			_ = sv.skusRepo.DeleteSkuById(newSkuId)
			var pqErr *pq.Error
			if errors.As(addSkusVariantOptionsErr, &pqErr) {
				return pg_error.GetMessageError(pqErr)
			}
			return response.ErrCodeInternal
		}
	}
	return response.SuccessCode
}

func (sv *SkusService) GetAllSkusOfVendor(id string, filterParam validator.FilterSkuValidator) (int, map[string]interface{}) {
	vendorId, _ := uuid.Parse(id)
	skus, err := sv.skusRepo.GetAllSkusByVendorId(vendorId, filterParam)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			log.Println(err)
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
	totalPages := internal.CalculateTotalPages(totalResults, limit)
	var allResponseData []SkuResponse
	for _, sku := range pagination {
		resData, maErr := mapResponseData(&sku)
		if maErr != nil {
			log.Println(maErr)
		}
		if resData != nil {
			allResponseData = append(allResponseData, *resData)
		}
	}
	results := map[string]interface{}{
		"totalPage": totalPages,
		"total":     totalResults,
		"skus":      allResponseData,
		"page":      page,
		"limit":     limit,
	}
	return response.SuccessCode, results
}

func (sv *SkusService) UpdateSku(id string, customParam validator.UpdateSkuValidator) int {
	skuId, _ := uuid.Parse(id)
	sku, err := sv.skusRepo.GetSkuById(skuId)
	if err != nil {
		return response.ErrCodeNoContent
	}
	if customParam.SKU != nil {
		sku.Sku = *customParam.SKU
	}
	if customParam.Price != nil {
		sku.Price = int64(*customParam.Price)
	}
	if customParam.Offer != nil {
		sku.Offer = sql.NullInt32{
			Int32: int32(*customParam.Offer),
			Valid: true,
		}
		if *customParam.Offer != 0 && (customParam.OfferStartDate == nil || customParam.OfferEndDate == nil) {
			return response.ErrCodeDateIsRequired
		}
	}
	if customParam.InStock != nil {
		sku.InStock = sql.NullInt16{
			Int16: int16(*customParam.InStock),
			Valid: true,
		}
	}
	if customParam.OfferStartDate != nil {
		if customParam.OfferEndDate == nil {
			return response.ErrCodeEndDateEmpty
		}
		startDateStr := *customParam.OfferStartDate
		startDate, parseErr := time.Parse("02-01-2006 15:04", startDateStr)
		if parseErr != nil {
			return response.ErrCodeInvalidDateTimeFormat
		}
		endDateStr := *customParam.OfferEndDate
		endDate, parseErr := time.Parse("02-01-2006 15:04", endDateStr)
		if parseErr != nil {
			return response.ErrCodeInvalidDateTimeFormat
		}
		if time.Now().After(startDate) {
			return response.ErrCodeInvalidFlashSaleStartDate
		}
		if endDate.Before(startDate) {
			return response.ErrCodeInvalidEndDate
		}
		sku.OfferStartDate = sql.NullTime{
			Time:  startDate,
			Valid: true,
		}
		sku.OfferEndDate = sql.NullTime{
			Time:  endDate,
			Valid: true,
		}
		if startDate.IsZero() || sku.Offer.Int32 == 0 {
			sku.OfferStartDate.Valid = false
		}
		if endDate.IsZero() || sku.Offer.Int32 == 0 {
			sku.OfferStartDate.Valid = false
		}
	}
	if customParam.Status != nil {
		if *customParam.Status != "inactive" && *customParam.Status != "active" {
			return response.ErrCodeInvalidSkuStatus
		}
		sku.Status = database.SkuStatus(*customParam.Status)
	}
	err = sv.skusRepo.UpdateSkuById(*sku)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr)
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (sv *SkusService) DeleteSkuById(id string) int {
	skuId, _ := uuid.Parse(id)
	sku, findErr := sv.skusRepo.GetSkuById(skuId)
	if findErr != nil {
		return response.ErrCodeNoContent
	}
	if sku.InStock.Int16 > 0 {
		return response.ErrCodeInStock
	}
	err := sv.skusRepo.DeleteSkuById(skuId)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr)
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (sv *SkusService) GetSkuById(id string) (int, *SkuResponse) {
	skuId, _ := uuid.Parse(id)
	sku, err := sv.skusRepo.GetSkuById(skuId)
	if err != nil {
		return response.ErrCodeNoContent, nil
	}
	resData, _ := mapResponseData(sku)
	return response.SuccessCode, resData
}

func mapResponseData[T any](data *T) (*SkuResponse, error) {
	switch s := any(data).(type) {
	case *database.GetAllSkuOfVendorRow:
		return &SkuResponse{
			ProductName:    s.ProductName,
			ProductId:      s.ProductID.String(),
			Id:             s.ID.UUID.String(),
			Sku:            s.Sku.String,
			Price:          int(s.Price.Int64),
			Variants:       s.VariantOptions,
			InStock:        int(s.InStock.Int16),
			Offer:          int(s.Offer.Int32),
			OfferStartDate: s.OfferStartDate.Time.Format("02-01-2006 15:04"),
			OfferEndDate:   s.OfferEndDate.Time.Format("02-01-2006 15:04"),
			OfferPrice:     int(s.OfferPrice),
			Status:         string(s.Status.SkuStatus),
		}, nil
	case *database.GetSkuByIdRow:
		return &SkuResponse{
			Id:             s.ID.String(),
			ProductName:    s.ProductName,
			ProductId:      s.ProductID.String(),
			Sku:            s.Sku,
			Price:          int(s.Price),
			OfferPrice:     int(s.OfferPrice),
			Offer:          int(s.Offer.Int32),
			OfferStartDate: s.OfferStartDate.Time.Format("02-01-2006 15:04"),
			OfferEndDate:   s.OfferEndDate.Time.Format("02-01-2006 15:04"),
			Variants:       s.VariantOptions,
			Status:         string(s.Status),
			InStock:        int(s.InStock.Int16),
		}, nil
	default:
		log.Println("Unhandled data type:", data)
		return nil, nil
	}
}
