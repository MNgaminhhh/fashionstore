package repository

import (
	"backend/global"
	"backend/internal/database"
	"backend/internal/validator"
	"database/sql"
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
	CreateFlashSaleItem(customParam validator.CreateFlashSaleItemValidator) error
	GetAllFlashSaleItemByFlashSaleId(flashSaleId uuid.UUID, filterParam validator.FilterFlashSaleItemValidator) ([]database.GetAllFlashSaleItemByFlashSaleIdRow, error)
	UpdateFlashSaleItem(newFlashSaleItem *database.GetFlashSaleItemByIdRow) error
	DeleteFlashSaleItemById(id uuid.UUID) error
	GetFlashSaleItemById(id uuid.UUID) (*database.GetFlashSaleItemByIdRow, error)
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

func (fr *FlashSalesRepository) CreateFlashSaleItem(customParam validator.CreateFlashSaleItemValidator) error {
	flashSaleId, _ := uuid.Parse(customParam.FlashSaleId)
	productId, _ := uuid.Parse(customParam.ProductId)
	param := database.CreateFlashSaleItemParams{
		FlashSalesID: flashSaleId,
		ProductID:    productId,
		Show:         sql.NullBool{},
	}
	if customParam.Show != nil {
		param.Show = sql.NullBool{
			Bool:  *customParam.Show,
			Valid: true,
		}
	}
	err := fr.sqlc.CreateFlashSaleItem(ctx, param)
	return err
}

func (fr *FlashSalesRepository) GetAllFlashSaleItemByFlashSaleId(flashSaleId uuid.UUID, filterParam validator.FilterFlashSaleItemValidator) ([]database.GetAllFlashSaleItemByFlashSaleIdRow, error) {
	param := database.GetAllFlashSaleItemByFlashSaleIdParams{
		FlashSalesID: flashSaleId,
		Column2:      sql.NullString{},
		Show:         sql.NullBool{},
	}
	if filterParam.ProductName != nil {
		param.Column2 = sql.NullString{
			String: *filterParam.ProductName,
			Valid:  true,
		}
	}
	if filterParam.Show != nil {
		param.Show = sql.NullBool{
			Bool:  *filterParam.Show,
			Valid: true,
		}
	}
	result, err := fr.sqlc.GetAllFlashSaleItemByFlashSaleId(ctx, param)
	if err != nil {
		return nil, err
	}
	return result, err
}

func (fr *FlashSalesRepository) UpdateFlashSaleItem(newFlashSaleItem *database.GetFlashSaleItemByIdRow) error {
	param := database.UpdateFlashSaleItemByIdParams{
		ProductID: newFlashSaleItem.ProductID,
		Show:      newFlashSaleItem.Show,
		ID:        newFlashSaleItem.ID,
	}
	err := fr.sqlc.UpdateFlashSaleItemById(ctx, param)
	return err
}

func (fr *FlashSalesRepository) DeleteFlashSaleItemById(id uuid.UUID) error {
	err := fr.sqlc.DeleteFlashSaleItemById(ctx, id)
	return err
}

func (fr *FlashSalesRepository) GetFlashSaleItemById(id uuid.UUID) (*database.GetFlashSaleItemByIdRow, error) {
	result, err := fr.sqlc.GetFlashSaleItemById(ctx, id)
	if err != nil {
		return nil, err
	}
	return &result, nil
}
