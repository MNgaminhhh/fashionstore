package repository

import (
	"backend/global"
	"backend/internal/database"
	"backend/internal/validator"
	"database/sql"
)

type IBrandsRepository interface {
	GetBrands(customParam validator.FilterBrandsRequest) ([]database.Brand, error)
}

type BrandsRepository struct {
	sqlc *database.Queries
}

func NewBrandsRepository() IBrandsRepository {
	return &BrandsRepository{sqlc: database.New(global.Mdb)}
}

func (br *BrandsRepository) GetBrands(customParam validator.FilterBrandsRequest) ([]database.Brand, error) {
	param := database.GetBrandsParams{
		Visible: sql.NullBool{
			Bool:  false,
			Valid: false,
		},
		Column2: customParam.Name,
	}
	if customParam.Visible != nil {
		param.Visible = sql.NullBool{
			Bool:  *customParam.Visible,
			Valid: true,
		}
	}
	brands, err := br.sqlc.GetBrands(ctx, param)
	if err != nil {
		return nil, err
	}
	return brands, nil
}
