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
)

type SkuResponse struct {
	Id          string          `json:"id"`
	ProductName string          `json:"product_name,omitempty"`
	ProductId   string          `json:"product_id,omitempty"`
	Sku         string          `json:"sku,omitempty"`
	Price       int             `json:"price,omitempty"`
	OfferPrice  int             `json:"offer_price,omitempty"`
	Offer       int             `json:"offer"`
	Variants    json.RawMessage `json:"variants,omitempty"`
	InStock     int             `json:"in_stock,omitempty"`
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
	err := sv.skusRepo.CreateSku(newSkuId, customParam)
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
	totalPages := internal.CalculateTotalPages(totalResults, page)
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
	}
	if customParam.InStock != nil {
		sku.InStock = sql.NullInt16{
			Int16: int16(*customParam.InStock),
			Valid: true,
		}
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
		log.Println(err)
		return response.ErrCodeNoContent, nil
	}
	resData, _ := mapResponseData(sku)
	return response.SuccessCode, resData
}

func mapResponseData[T any](data *T) (*SkuResponse, error) {
	switch s := any(data).(type) {
	case *database.GetAllSkuOfVendorRow:
		return &SkuResponse{
			ProductName: s.ProductName,
			ProductId:   s.ProductID.String(),
			Id:          s.ID.UUID.String(),
			Sku:         s.Sku.String,
			Price:       int(s.Price.Int64),
			Variants:    s.VariantOptions,
			InStock:     int(s.InStock.Int16),
			Offer:       int(s.Offer.Int32),
			OfferPrice:  int(s.OfferPrice),
		}, nil
	case *database.GetSkuByIdRow:
		return &SkuResponse{
			Id:          s.ID.String(),
			ProductName: s.ProductName.String,
			ProductId:   s.ProductID.String(),
			Sku:         s.Sku,
			Price:       int(s.Price),
			OfferPrice:  int(s.OfferPrice),
			Offer:       int(s.Offer.Int32),
			Variants:    s.VariantOptions,
			InStock:     int(s.InStock.Int16),
		}, nil
	default:
		log.Println("Unhandled data type:", data)
		return nil, nil
	}
}
