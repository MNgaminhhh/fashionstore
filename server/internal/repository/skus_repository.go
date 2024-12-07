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

type ISkusRepository interface {
	CreateSku(id uuid.UUID, customParam validator.CreateSkuValidator, offerStartDate *time.Time, offerEndDate *time.Time) error
	GetAllSkusByProductId(productId uuid.UUID) ([]database.GetAllSkuByProductIdRow, error)
	GetAllSkusByVendorId(vendorId uuid.UUID, filterParam validator.FilterSkuValidator) ([]database.GetAllSkuOfVendorRow, error)
	DeleteSkuById(id uuid.UUID) error
	UpdateSkuById(sku database.GetSkuByIdRow) error
	GetSkuById(id uuid.UUID) (*database.GetSkuByIdRow, error)
}

type SkusRepository struct {
	sqlc *database.Queries
}

func NewSkusRepository() ISkusRepository {
	return &SkusRepository{
		sqlc: database.New(global.Mdb),
	}
}

func (sr *SkusRepository) CreateSku(id uuid.UUID, customParam validator.CreateSkuValidator, offerStartDate *time.Time, offerEndDate *time.Time) error {
	productId, _ := uuid.Parse(customParam.ProductId)
	param := database.CreateSKUParams{
		ID:        id,
		ProductID: productId,
		InStock: sql.NullInt16{
			Int16: int16(customParam.InStock),
			Valid: true,
		},
		Sku:    customParam.Sku,
		Status: database.SkuStatus(customParam.Status),
		Price:  int64(customParam.Price),
		Offer: sql.NullInt32{
			Int32: int32(customParam.Offer),
			Valid: true,
		},
	}
	if offerStartDate != nil && !offerStartDate.IsZero() && offerEndDate != nil && !offerEndDate.IsZero() {
		param.OfferStartDate = sql.NullTime{
			Time:  *offerStartDate,
			Valid: true,
		}
		param.OfferEndDate = sql.NullTime{
			Time:  *offerEndDate,
			Valid: true,
		}
	}
	err := sr.sqlc.CreateSKU(ctx, param)
	return err
}

func (sr *SkusRepository) GetAllSkusByVendorId(vendorId uuid.UUID, filterParam validator.FilterSkuValidator) ([]database.GetAllSkuOfVendorRow, error) {
	param := database.GetAllSkuOfVendorParams{
		VendorID: vendorId,
		Price:    -1,
		Price_2:  -1,
	}
	if filterParam.Sku != nil {
		param.Sku = *filterParam.Sku
	}
	if filterParam.ProductName != nil {
		param.Sku = *filterParam.ProductName
	}
	if filterParam.ProductId != nil {
		param.Column4 = *filterParam.ProductId
	}
	if filterParam.Price != nil {
		param.Price = int64(*filterParam.Price)
	}
	if filterParam.Offer != nil {
		param.Offer.Valid = true
		param.Offer.Int32 = int32(*filterParam.Offer)
	}
	if filterParam.OfferPrice != nil {
		param.Price_2 = int64(*filterParam.OfferPrice)
	}
	results, err := sr.sqlc.GetAllSkuOfVendor(ctx, param)
	if err != nil {
		return nil, err
	}
	return results, nil
}

func (sr *SkusRepository) DeleteSkuById(id uuid.UUID) error {
	err := sr.sqlc.DeleteSkuById(ctx, id)
	return err
}

func (sr *SkusRepository) GetAllSkusByProductId(productId uuid.UUID) ([]database.GetAllSkuByProductIdRow, error) {
	log.Println(productId)
	results, err := sr.sqlc.GetAllSkuByProductId(ctx, productId)
	if err != nil {
		return nil, err
	}
	log.Println(len(results))
	return results, nil
}

func (sr *SkusRepository) UpdateSkuById(sku database.GetSkuByIdRow) error {
	param := database.UpdateSkuByIdParams{
		Sku:            sku.Sku,
		Offer:          sku.Offer,
		InStock:        sku.InStock,
		Price:          sku.Price,
		ID:             sku.ID,
		OfferStartDate: sku.OfferStartDate,
		OfferEndDate:   sku.OfferEndDate,
		Status:         sku.Status,
	}
	err := sr.sqlc.UpdateSkuById(ctx, param)
	return err
}

func (sr *SkusRepository) GetSkuById(id uuid.UUID) (*database.GetSkuByIdRow, error) {
	sku, err := sr.sqlc.GetSkuById(ctx, id)
	if err != nil {
		return nil, err
	}
	return &sku, nil
}
