package repository

import (
	"backend/global"
	"backend/internal/database"
	"backend/internal/validator"
	"database/sql"
	"log"
)

type IBannersRepository interface {
	AddBanner(customParam validator.AddBannerRequest) error
	GetBannerByStatus(status int) ([]database.Banner, error)
	GetAllBanners() ([]database.Banner, error)
}

type BannersRepository struct {
	sqlc *database.Queries
}

func NewBannersRepository() IBannersRepository {
	return &BannersRepository{
		sqlc: database.New(global.Mdb),
	}
}

func (br *BannersRepository) AddBanner(customParam validator.AddBannerRequest) error {
	param := database.AddBannerParams{
		Title:       customParam.Title,
		BannerImage: customParam.BannerImage,
		Description: sql.NullString{Valid: false},
		Text:        customParam.ButtonText,
		Link: sql.NullString{
			Valid: false,
		},
		Serial: sql.NullInt32{
			Int32: int32(customParam.Serial),
			Valid: true,
		},
	}
	if customParam.ButtonLink != nil {
		param.Link = sql.NullString{
			Valid:  true,
			String: *customParam.ButtonLink,
		}
	}
	if customParam.Description != nil {
		param.Description = sql.NullString{
			Valid:  true,
			String: *customParam.Description,
		}
	}
	err := br.sqlc.AddBanner(ctx, param)
	return err
}

func (br *BannersRepository) GetBannerByStatus(status int) ([]database.Banner, error) {
	banners, err := br.sqlc.GetBannersByStatus(ctx, int32(status))
	if err != nil {
		log.Println(err)
		return nil, err
	}
	return banners, nil
}

func (br *BannersRepository) GetAllBanners() ([]database.Banner, error) {
	banners, err := br.sqlc.GetAllBanners(ctx)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	return banners, nil
}