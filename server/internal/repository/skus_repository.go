package repository

import (
	"backend/global"
	"backend/internal/database"
	"backend/internal/validator"
	"database/sql"
	"github.com/google/uuid"
)

type ISkusRepository interface {
	CreateSku(customParam validator.CreateSkuValidator) error
	GetAllSkusByProductId(productId uuid.UUID) ([]database.GetAllSkuByProductIdRow, error)
	GetAllSkusByVendorId(vendorId uuid.UUID, filterParam validator.FilterSkuValidator) ([]database.GetAllSkuOfVendorRow, error)
}

type SkusRepository struct {
	sqlc *database.Queries
}

func NewSkusRepository() ISkusRepository {
	return &SkusRepository{
		sqlc: database.New(global.Mdb),
	}
}

func (sr *SkusRepository) CreateSku(customParam validator.CreateSkuValidator) error {
	productId, _ := uuid.Parse(customParam.ProductId)
	param := database.CreateSKUParams{
		ProductID: productId,
		InStock: sql.NullInt16{
			Int16: int16(customParam.InStock),
			Valid: true,
		},
		Sku:   "",
		Price: int64(customParam.Price),
		Offer: sql.NullInt32{
			Int32: int32(customParam.Offer),
			Valid: true,
		},
		VariantOptionIds: customParam.VariantOptions,
	}
	err := sr.sqlc.CreateSKU(ctx, param)
	return err
}

func (sr *SkusRepository) GetAllSkusByVendorId(vendorId uuid.UUID, filterParam validator.FilterSkuValidator) ([]database.GetAllSkuOfVendorRow, error) {
	param := database.GetAllSkuOfVendorParams{
		VendorID: vendorId,
	}
	if filterParam.Sku != nil {
		param.Sku = *filterParam.Sku
	}
	if filterParam.ProductName != nil {
		param.Sku = *filterParam.ProductName
	}
	results, err := sr.sqlc.GetAllSkuOfVendor(ctx, param)
	if err != nil {
		return nil, err
	}
	return results, nil
}

func (sr *SkusRepository) GetAllSkusByProductId(productId uuid.UUID) ([]database.GetAllSkuByProductIdRow, error) {
	results, err := sr.sqlc.GetAllSkuByProductId(ctx, productId)
	if err != nil {
		return nil, err
	}
	return results, nil
}
