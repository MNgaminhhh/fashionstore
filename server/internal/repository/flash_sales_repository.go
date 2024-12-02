package repository

import (
	"backend/global"
	"backend/internal/database"
	"github.com/google/uuid"
	"log"
	"time"
)

type IFlashSalesRepository interface {
	CreateFlashSale(startDate time.Time, endDate time.Time) error
	GetAllFlashSales(startDate time.Time, endDate time.Time) ([]database.FlashSale, error)
	GetFlashSalesById(id uuid.UUID) (*database.FlashSale, error)
	UpdateFlashSale(newFlashSale database.FlashSale) error
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

func (fr *FlashSalesRepository) GetAllFlashSales(startDate time.Time, endDate time.Time) ([]database.FlashSale, error) {
	param := database.GetAllFlashSalesParams{
		Column1: startDate,
		Column2: endDate,
	}
	log.Println(param)
	results, err := fr.sqlc.GetAllFlashSales(ctx, param)
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

func (fr *FlashSalesRepository) UpdateFlashSale(newFlashSale database.FlashSale) error {
	param := database.UpdateFlashSaleParams{
		StartDate: newFlashSale.StartDate,
		EndDate:   newFlashSale.EndDate,
		ID:        newFlashSale.ID,
	}
	err := fr.sqlc.UpdateFlashSale(ctx, param)
	return err
}

func (fr *FlashSalesRepository) DeleteFlashSaleById(id uuid.UUID) error {
	err := fr.sqlc.DeleteFlashSaleById(ctx, id)
	return err
}
