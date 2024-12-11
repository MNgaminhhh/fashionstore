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
	GetBrands(customParam *validator.FilterBrandsRequest) (int, map[string]interface{})
	UpdateBrand(customParam validator.UpdateBrandRequest, id uuid.UUID) int
	GetBrandById(id string) (int, *BrandsResponseData)
	DeleteBrandById(id string) int
	AddBrand(param validator.AddBrandRequest) int
}

type BrandsService struct {
	brandsRepository repository.IBrandsRepository
}

func NewBrandsService(brandsRepository repository.IBrandsRepository) IBrandsService {
	return &BrandsService{
		brandsRepository: brandsRepository,
	}
}

func (bs *BrandsService) GetBrands(customParam *validator.FilterBrandsRequest) (int, map[string]interface{}) {
	var visible sql.NullBool
	if customParam.Visible != nil {
		visible = sql.NullBool{
			Bool:  *customParam.Visible,
			Valid: true,
		}
	} else {
		visible = sql.NullBool{
			Valid: false,
		}
	}

	params := database.GetBrandsParams{
		Visible: visible,
		Column2: customParam.Name,
	}

	brands, err := bs.brandsRepository.GetBrands(params)
	if err != nil {
		log.Println("Error fetching brands:", err)
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			switch pqErr.Code.Name() {
			case "unique_violation":
				return response.ErrCodeConflict, nil
			case "foreign_key_violation":
				return response.ErrCodeForeignKey, nil
			case "check_violation":
				return response.ErrCodeValidate, nil
			default:
				return response.ErrCodeDatabase, nil
			}
		}
		return response.ErrCodeInternal, nil
	}
	limit := len(brands)
	page := 1
	if customParam.Limit != nil {
		limit = *customParam.Limit
	}
	if customParam.Page != nil {
		page = *customParam.Page
	}
	totalResults := len(brands)
	totalPages := internal.CalculateTotalPages(totalResults, limit)
	brands = internal.Paginate(brands, page, limit)
	var responseData []BrandsResponseData
	for _, brand := range brands {
		data := MapBrandToResponseData(&brand)
		responseData = append(responseData, *data)
	}

	data := map[string]interface{}{
		"total_pages":   totalPages,
		"page":          page,
		"total_results": totalResults,
		"brands":        responseData,
	}

	return http.StatusOK, data
}

func (bs *BrandsService) UpdateBrand(customParam validator.UpdateBrandRequest, id uuid.UUID) int {
	newBrand, err := bs.brandsRepository.GetBrandByID(id)
	if err != nil {
		return response.ErrCodeBrandNotFound
	}
	if customParam.Name != nil {
		newBrand.Name = *customParam.Name
	}
	if customParam.Visible != nil {
		newBrand.Visible = sql.NullBool{
			Bool:  *customParam.Visible,
			Valid: true,
		}
	}
	if customParam.Image != nil {
		newBrand.Image = *customParam.Image
	}
	if customParam.Sequence != nil {
		newBrand.Sequence = int32(*customParam.Sequence)
	}
	err = bs.brandsRepository.SaveBrands(newBrand)
	if err != nil {
		return response.ErrCodeBrandNotFound
	}
	return response.SuccessCode
}

func (bs *BrandsService) GetBrandById(id string) (int, *BrandsResponseData) {
	brandId, _ := uuid.Parse(id)
	brand, err := bs.brandsRepository.GetBrandByID(brandId)
	if err != nil {
		return response.ErrCodeBrandNotFound, nil
	}
	return response.SuccessCode, MapBrandToResponseData(brand)
}

func (bs *BrandsService) DeleteBrandById(id string) int {
	brandId, _ := uuid.Parse(id)
	err := bs.brandsRepository.DeleteBrandById(brandId)
	if err != nil {
		return response.ErrCodeBrandNotFound
	}
	return response.SuccessCode
}

func (bs *BrandsService) AddBrand(param validator.AddBrandRequest) int {
	id, _ := uuid.Parse(param.StoreId)
	log.Println(id)
	newBrand := database.Brand{
		Sequence: int32(param.Sequence),
		StoreID:  id,
		Name:     param.Name,
		Image:    param.Image,
		Visible: sql.NullBool{
			Bool:  param.Visible,
			Valid: true,
		},
	}
	err := bs.brandsRepository.AddBrand(&newBrand)
	if err != nil {
		var pqError *pq.Error
		if errors.As(err, &pqError) {
			if string(pqError.Code) == string(pg_error.ForeignKeyViolation) {
				if pqError.Constraint == "brands_store_id_fkey" {
					return response.ErrCodeVendorNotFound
				}
			}
			return response.ErrCodeInternal
		}
	}
	return response.SuccessCode
}

func MapBrandToResponseData(brand *database.Brand) *BrandsResponseData {
	return &BrandsResponseData{
		ID:       brand.ID,
		StoreID:  brand.StoreID,
		Name:     brand.Name,
		Sequence: int(brand.Sequence),
		Visible:  brand.Visible.Bool,
		Image:    brand.Image,
	}
}
