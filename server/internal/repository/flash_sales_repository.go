package repository

import (
	"backend/global"
	"backend/internal/database"
	"backend/internal/validator"
	"github.com/google/uuid"
	"time"
)

type IFlashSalesRepository interface {
	CreateFlashSale(startDate time.Time, endDate time.Time) error
	GetAllFlashSales() ([]database.FlashSale, error)
	GetFlashSalesById(id uuid.UUID) (*database.FlashSale, error)
	UpdateFlashSale(id uuid.UUID, customParam validator.UpdateFlashSaleValidator) error
	DeleteFlashSaleById(id uuid.UUID) error
}

type FlashSalesRepository struct {
	sqlc *database.Queries
}

func NewFlashSalesRepository() IFlashSalesRepository {
	return &FlashSalesRepository{
		sqlc: database.New(global.Mdb),
	}
}

func (fr *FlashSalesRepository) CreateFlashSale(startDate time.Time, endDate time.Time) error {
	err := fr.sqlc.CreateFlashSales(ctx, database.CreateFlashSalesParams{
		StartDate: startDate,
		EndDate:   endDate,
	})
	return err
}

func (fr *FlashSalesRepository) GetAllFlashSales() ([]database.FlashSale, error) {
	results, err := fr.sqlc.GetAllFlashSales(ctx)
	if err != nil {
		return nil, err
	}
	return results, nil
}

func (fr *FlashSalesRepository) GetFlashSalesById(id uuid.UUID) (*database.FlashSale, error) {
	flashSale, err := fr.sqlc.GetFlashSaleById(ctx, id)
	if err != nil {
		return nil, err
	}
	return &flashSale, nil
}

func (fr *FlashSalesRepository) UpdateFlashSale(id uuid.UUID, customParam validator.UpdateFlashSaleValidator) error {
	param := database.UpdateFlashSaleParams{
		StartDate: time.Time{},
		EndDate:   time.Time{},
		ID:        id,
	}
	if customParam.StartDate != nil {
		param.StartDate = *customParam.StartDate
	}
	if customParam.EndDate != nil {
		param.EndDate = *customParam.EndDate
	}
	err := fr.sqlc.UpdateFlashSale(ctx, param)
	return err
}

func (fr *FlashSalesRepository) DeleteFlashSaleById(id uuid.UUID) error {
	err := fr.sqlc.DeleteFlashSaleById(ctx, id)
	return err
}
