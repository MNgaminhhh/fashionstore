package repository

import (
	"backend/global"
	"backend/internal/database"
	"backend/internal/validator"
	"github.com/google/uuid"
	"log"
)

type ISkusVariantOptions interface {
	CreateSkusVariantOptions(customParam validator.CreateSkuVariantOptionValidator) error
	CheckExistVariantOptions(variantOptions []uuid.UUID) (*bool, error)
}

type SkusVariantOptionsRepository struct {
	sqlc *database.Queries
}

func NewSkusVariantOptionsRepository() ISkusVariantOptions {
	return &SkusVariantOptionsRepository{
		sqlc: database.New(global.Mdb),
	}
}

func (sr *SkusVariantOptionsRepository) CreateSkusVariantOptions(customParam validator.CreateSkuVariantOptionValidator) error {
	skuId, _ := uuid.Parse(customParam.SkuId)
	variantOptionId, _ := uuid.Parse(customParam.VariantOptionId)
	param := database.CreateSkuVariantOptionParams{
		SkuID:         skuId,
		VariantOption: variantOptionId,
	}
	err := sr.sqlc.CreateSkuVariantOption(ctx, param)
	return err
}

func (sr *SkusVariantOptionsRepository) CheckExistVariantOptions(variantOptions []uuid.UUID) (*bool, error) {
	result, err := sr.sqlc.CheckExistVariantOptions(ctx, variantOptions)
	log.Println(variantOptions)
	if err != nil {
		return nil, err
	}
	return &result, nil
}
