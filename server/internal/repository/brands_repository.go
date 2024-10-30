package repository

import (
	"backend/global"
	"backend/internal/database"
	"backend/internal/validator"
	"database/sql"
	"github.com/google/uuid"
	"log"
)

type IBrandsRepository interface {
	GetBrands(customParam validator.FilterBrandsRequest) ([]database.Brand, error)
	SaveBrands(newBrand *database.Brand) error
	GetBrandByID(id uuid.UUID) (*database.Brand, error)
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

func (br *BrandsRepository) SaveBrands(newBrand *database.Brand) error {
	param := database.UpdateBrandParams{
		Name:     newBrand.Name,
		Visible:  newBrand.Visible,
		Sequence: newBrand.Sequence,
		Image:    newBrand.Image,
		ID:       newBrand.ID,
	}
	err := br.sqlc.UpdateBrand(ctx, param)
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}

func (br *BrandsRepository) GetBrandByID(id uuid.UUID) (*database.Brand, error) {
	brand, err := br.sqlc.GetBrandById(ctx, id)
	if err != nil {
		return nil, err
	}
	return &brand, err
}
