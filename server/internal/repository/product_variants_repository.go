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
	CreateVariantOption(customParam validator.CreateVariantOptionValidator) error
	GetListVariantOptionsByPvId(pvId uuid.UUID, customParam validator.FilterVariantOptionValidator) ([]database.GetAllVariantOptionsByPvIdRow, error)
	UpdateVariantOptionById(variantOption *database.VariantOption) error
	DeleteVariantOptionById(id uuid.UUID) error
	GetVariantOptionById(id uuid.UUID) (*database.VariantOption, error)
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

func (vr *ProductVariantsRepository) CreateVariantOption(customParam validator.CreateVariantOptionValidator) error {
	pvId, _ := uuid.Parse(customParam.ProductVariant)
	param := database.CreateVariantOptionsParams{
		Name:             customParam.Name,
		ProductVariantID: pvId,
		Status: database.NullVariantsStatus{
			VariantsStatus: database.VariantsStatus(customParam.Status),
			Valid:          true,
		},
	}
	err := vr.sqlc.CreateVariantOptions(ctx, param)
	return err
}

func (vr *ProductVariantsRepository) GetListVariantOptionsByPvId(pvId uuid.UUID, customParam validator.FilterVariantOptionValidator) ([]database.GetAllVariantOptionsByPvIdRow, error) {
	var param = database.GetAllVariantOptionsByPvIdParams{
		ID: pvId,
	}
	if customParam.Name != nil {
		param.Column1 = sql.NullString{
			String: *customParam.Name,
			Valid:  *customParam.Name != "",
		}
	}
	if customParam.Status != nil {
		param.Status = database.NullVariantsStatus{
			VariantsStatus: database.VariantsStatus(*customParam.Status),
			Valid:          true,
		}
	}
	if customParam.ProductVariantName != nil {
		param.Column3 = sql.NullString{
			String: *customParam.ProductVariantName,
			Valid:  *customParam.ProductVariantName != "",
		}
	}
	results, err := vr.sqlc.GetAllVariantOptionsByPvId(ctx, param)
	if err != nil {
		return nil, err
	}
	return results, nil
}

func (vr *ProductVariantsRepository) UpdateVariantOptionById(variantOption *database.VariantOption) error {
	param := database.UpdateVariantOptionByIdParams{
		Name:   variantOption.Name,
		Status: variantOption.Status,
		ID:     variantOption.ID,
	}
	log.Println(variantOption.ID)
	return vr.sqlc.UpdateVariantOptionById(ctx, param)
}

func (vr *ProductVariantsRepository) DeleteVariantOptionById(id uuid.UUID) error {
	return vr.sqlc.DeleteVariantOptionById(ctx, id)
}

func (vr *ProductVariantsRepository) GetVariantOptionById(id uuid.UUID) (*database.VariantOption, error) {
	vo, err := vr.sqlc.GetVariantOptionById(ctx, id)
	if err != nil {
		return nil, err
	}
	return &vo, nil
}
