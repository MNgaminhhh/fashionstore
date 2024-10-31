package service

import (
	"backend/internal/database"
	"backend/internal/repository"
	"backend/internal/validator"
	"backend/pkg/response"
	"github.com/google/uuid"
)

type BannerResponse struct {
	ID          uuid.UUID `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description,omitempty"`
	ButtonText  string    `json:"button_text"`
	ButtonLink  string    `json:"button_link,omitempty"`
	Serial      int       `json:"serial"`
	BannerImage string    `json:"banner_image"`
}

type IBannersService interface {
	AddBanner(customParam validator.AddBannerRequest) int
	GetActiveBanners() (int, []BannerResponse)
	GetAllBanners() (int, []BannerResponse)
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
		resData := mapBannerToResponseData(banner)
		data = append(data, resData)
	}
	return response.SuccessCode, data
}

func (bs *BannerService) GetAllBanners() (int, []BannerResponse) {
	banners, err := bs.bannerRepo.GetAllBanners()
	if err != nil {
		return response.ErrCodeInternal, nil
	}
	var data []BannerResponse
	for _, banner := range banners {
		resData := mapBannerToResponseData(banner)
		data = append(data, resData)
	}
	return response.SuccessCode, data
}

func mapBannerToResponseData(banner database.Banner) BannerResponse {
	return BannerResponse{
		ID:          banner.ID,
		Title:       banner.Title,
		ButtonText:  banner.Text,
		Description: banner.Description.String,
		ButtonLink:  banner.Link.String,
		Serial:      int(banner.Serial.Int32),
		BannerImage: banner.BannerImage,
	}
}
