package repository

import (
	"backend/global"
	"backend/internal/database"
	"backend/internal/validator"
	"database/sql"
	"github.com/google/uuid"
	"log"
)

type IProductVariantsRepository interface {
	CreateProductVariant(customParam validator.CreateProductVariantValidator) error
	GetListProductVariants(name *string, status *string) ([]database.ProductVariant, error)
	GetProductVariantById(id uuid.UUID) (*database.ProductVariant, error)
	DeleteProductVariantById(id uuid.UUID) error
	UpdateProductVariant(pVariant *database.ProductVariant) error
}

type ProductVariantsRepository struct {
	sqlc *database.Queries
}

func NewProductVariantsRepository() IProductVariantsRepository {
	return &ProductVariantsRepository{
		sqlc: database.New(global.Mdb),
	}
}

func (vr *ProductVariantsRepository) CreateProductVariant(customParam validator.CreateProductVariantValidator) error {
	param := database.CreateProductVariantParams{
		Name: customParam.Name,
		Status: database.NullVariantsStatus{
			VariantsStatus: database.VariantsStatus(*customParam.Status),
			Valid:          true,
		},
	}
	return vr.sqlc.CreateProductVariant(ctx, param)
}

func (vr *ProductVariantsRepository) GetListProductVariants(name *string, status *string) ([]database.ProductVariant, error) {
	param := database.GetAllProductVariantsParams{}
	if name != nil {
		param.Column1 = sql.NullString{
			String: *name,
			Valid:  true,
		}
	}
	if status != nil {
		param.Status = database.NullVariantsStatus{
			VariantsStatus: database.VariantsStatus(*status),
			Valid:          true,
		}
	}
	log.Println(param)
	results, err := vr.sqlc.GetAllProductVariants(ctx, param)
	if err != nil {
		return nil, err
	}
	return results, nil
}

func (vr *ProductVariantsRepository) GetProductVariantById(id uuid.UUID) (*database.ProductVariant, error) {
	productVariant, err := vr.sqlc.GetProductVariantById(ctx, id)
	if err != nil {
		return nil, err
	}
	return &productVariant, nil
}

func (vr *ProductVariantsRepository) DeleteProductVariantById(id uuid.UUID) error {
	return vr.sqlc.DeleteProductVariantById(ctx, id)
}

func (vr *ProductVariantsRepository) UpdateProductVariant(pVariant *database.ProductVariant) error {
	updateParam := database.UpdateProductVariantParams{
		Name:   pVariant.Name,
		Status: pVariant.Status,
		ID:     pVariant.ID,
	}
	return vr.sqlc.UpdateProductVariant(ctx, updateParam)
}
