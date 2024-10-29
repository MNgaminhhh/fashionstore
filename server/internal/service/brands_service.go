package service

import (
	"backend/internal"
	"backend/internal/database"
	"backend/internal/repository"
	"backend/internal/validator"
	"github.com/google/uuid"
	"log"
	"net/http"
)

type BrandsResponseData struct {
	ID       uuid.UUID `json:"id"`
	StoreID  uuid.UUID `json:"store_id"`
	Name     string    `json:"name"`
	Sequence int       `json:"sequence"`
	Visible  bool      `json:"visible"`
	Image    string    `json:"image"`
}

type IBrandsService interface {
	GetBrands(customParam validator.FilterBrandsRequest) (int, map[string]interface{})
}

type BrandsService struct {
	brandsRepository repository.IBrandsRepository
}

func NewBrandsService(brandsRepository repository.IBrandsRepository) IBrandsService {
	return &BrandsService{
		brandsRepository: brandsRepository,
	}
}

func (bs *BrandsService) GetBrands(customParam validator.FilterBrandsRequest) (int, map[string]interface{}) {
	brands, err := bs.brandsRepository.GetBrands(customParam)
	if err != nil {
		log.Println(err)
		return http.StatusInternalServerError, nil
	}
	var responseData []BrandsResponseData
	for _, brand := range brands {
		data := MapBrandToResponseData(brand)
		responseData = append(responseData, data)
	}
	limit := 10
	page := 1
	if customParam.Limit != 0 {
		limit = customParam.Limit
	}
	if customParam.Page != 0 {
		page = customParam.Page
	}
	responseData = internal.Paginate(responseData, page, limit)
	totalPage := internal.CalculateTotalPages(len(brands), limit)
	data := map[string]interface{}{
		"total_page":    totalPage,
		"page":          page,
		"total_results": len(responseData),
		"brands":        responseData,
	}
	return http.StatusOK, data
}

func MapBrandToResponseData(brand database.Brand) BrandsResponseData {
	return BrandsResponseData{
		ID:       brand.ID,
		StoreID:  brand.StoreID,
		Name:     brand.Name,
		Sequence: int(brand.Sequence.Int32),
		Visible:  brand.Visible.Bool,
		Image:    brand.Image,
	}
}
