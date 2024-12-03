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

func mapResponseData[T any](data *T) (*SkuResponse, error) {
	switch s := any(data).(type) {
	case *database.GetAllSkuOfVendorRow:
		//offer := int(s.Offer.Int32)
		//price := int(s.Price.Int64)
		////offerPrice := float64(price) * (1 - float64(offer)/100)
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
	default:
		log.Println("Unhandled data type:", data)
		return nil, nil
	}
}
