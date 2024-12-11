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
)

type BannerResponse struct {
	ID          uuid.UUID `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description,omitempty"`
	ButtonText  string    `json:"button_text"`
	ButtonLink  string    `json:"button_link,omitempty"`
	Serial      int       `json:"serial"`
	BannerImage string    `json:"banner_image"`
	Status      int       `json:"status"`
}

type IBannersService interface {
	AddBanner(customParam validator.AddBannerRequest) int
	GetActiveBanners() (int, []BannerResponse)
	GetAllBanners(customParam *validator.BannerRequest) (int, map[string]interface{})
	UpdateBanner(id string, customParam validator.BannerRequest) int
	DeleteBannerById(id string) int
	GetBannersById(id string) (int, *BannerResponse)
}

type BannerService struct {
	bannerRepo repository.IBannersRepository
}

func NewBannerService(bannerRepo repository.IBannersRepository) IBannersService {
	return &BannerService{bannerRepo: bannerRepo}
}

func (bs *BannerService) AddBanner(customParam validator.AddBannerRequest) int {
	err := bs.bannerRepo.AddBanner(customParam)
	if err != nil {
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (bs *BannerService) GetActiveBanners() (int, []BannerResponse) {
	banners, err := bs.bannerRepo.GetBannerByStatus(1)
	if err != nil {
		return response.ErrCodeInternal, nil
	}
	var data []BannerResponse
	for _, banner := range banners {
		resData := mapBannerToResponseData(&banner)
		data = append(data, *resData)
	}
	return response.SuccessCode, data
}

func (bs *BannerService) GetAllBanners(customParam *validator.BannerRequest) (int, map[string]interface{}) {
	param := database.GetAllBannersParams{
		Column1: sql.NullString{
			String: customParam.Title,
			Valid:  customParam.Title != "",
		},
		Column2: sql.NullString{
			String: customParam.Description,
			Valid:  customParam.Description != "",
		},
		Column3: sql.NullString{
			String: customParam.ButtonText,
			Valid:  customParam.ButtonText != "",
		},
		Column4: sql.NullString{
			String: customParam.ButtonLink,
			Valid:  customParam.ButtonLink != "",
		},
		Status: -1,
		Serial: sql.NullInt32{
			Int32: 0,
			Valid: false,
		},
	}
	if customParam.Serial != nil {
		param.Serial = sql.NullInt32{
			Int32: int32(*customParam.Serial),
			Valid: true,
		}
	}
	if customParam.Status != nil {
		param.Status = int32(*customParam.Status)
	}
	banners, err := bs.bannerRepo.GetAllBanners(param)
	if err != nil {
		return response.ErrCodeInternal, nil
	}
	limit := len(banners)
	if customParam.Limit != nil {
		limit = *customParam.Limit
	}
	page := 1
	if customParam.Page != nil {
		page = *customParam.Page
	}
	totalResults := len(banners)
	totalPages := internal.CalculateTotalPages(totalResults, limit)
	banners = internal.Paginate(banners, page, limit)
	var data []BannerResponse
	for _, banner := range banners {
		resData := mapBannerToResponseData(&banner)
		data = append(data, *resData)
	}
	results := map[string]interface{}{
		"total_pages":   totalPages,
		"page":          page,
		"banners":       data,
		"total_results": totalResults,
	}
	return response.SuccessCode, results
}

func (bs *BannerService) UpdateBanner(id string, customParam validator.BannerRequest) int {
	bannerId, _ := uuid.Parse(id)
	newBanner, err := bs.bannerRepo.GetBannerById(bannerId)
	if err != nil || newBanner == nil {
		return response.ErrCodeBannerNotFound
	}
	if customParam.Title != "" {
		newBanner.Title = customParam.Title
	}
	if customParam.Description != "" {
		newBanner.Description = sql.NullString{
			String: customParam.Description,
			Valid:  true,
		}
	}
	if customParam.BannerImage != "" {
		newBanner.BannerImage = customParam.BannerImage
	}
	if customParam.ButtonText != "" {
		newBanner.Text = customParam.ButtonText
	}
	if customParam.ButtonLink != "" {
		newBanner.Link = sql.NullString{
			String: customParam.ButtonLink,
			Valid:  true,
		}
	}
	if customParam.Serial != nil {
		newBanner.Serial = sql.NullInt32{
			Int32: int32(*customParam.Serial),
			Valid: true,
		}
	}
	if customParam.Status != nil {
		newBanner.Status = int32(*customParam.Status)
	}
	err = bs.bannerRepo.UpdateBanner(newBanner)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr)
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (bs *BannerService) DeleteBannerById(id string) int {
	bannerId, _ := uuid.Parse(id)
	err := bs.bannerRepo.DeleteBannerById(bannerId)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr)
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (bs *BannerService) GetBannersById(id string) (int, *BannerResponse) {
	bannerId, _ := uuid.Parse(id)
	banner, err := bs.bannerRepo.GetBannerById(bannerId)
	if err != nil {
		return response.ErrCodeBannerNotFound, nil
	}
	return response.SuccessCode, mapBannerToResponseData(banner)
}

func mapBannerToResponseData(banner *database.Banner) *BannerResponse {
	return &BannerResponse{
		ID:          banner.ID,
		Title:       banner.Title,
		ButtonText:  banner.Text,
		Description: banner.Description.String,
		ButtonLink:  banner.Link.String,
		Serial:      int(banner.Serial.Int32),
		BannerImage: banner.BannerImage,
		Status:      int(banner.Status),
	}
}
