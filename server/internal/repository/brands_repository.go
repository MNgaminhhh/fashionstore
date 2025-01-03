package repository

import (
	"backend/global"
	"backend/internal/database"
	"github.com/google/uuid"
	"log"
)

type IBrandsRepository interface {
	GetBrands(customParam database.GetBrandsParams) ([]database.Brand, error)
	SaveBrands(newBrand *database.Brand) error
	GetBrandByID(id uuid.UUID) (*database.Brand, error)
	DeleteBrandById(id uuid.UUID) error
	AddBrand(newBrand *database.Brand) error
}

type BrandsRepository struct {
	sqlc *database.Queries
}

func NewBrandsRepository() IBrandsRepository {
	return &BrandsRepository{sqlc: database.New(global.Mdb)}
}

func (br *BrandsRepository) GetBrands(customParam database.GetBrandsParams) ([]database.Brand, error) {
	brands, err := br.sqlc.GetBrands(ctx, customParam)
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

func (br *BrandsRepository) DeleteBrandById(id uuid.UUID) error {
	err := br.sqlc.DeleteById(ctx, id)
	return err
}

func (br *BrandsRepository) AddBrand(newBrand *database.Brand) error {
	param := database.AddBrandParams{
		Name:     newBrand.Name,
		Visible:  newBrand.Visible,
		Image:    newBrand.Image,
		Sequence: newBrand.Sequence,
		StoreID:  newBrand.StoreID,
	}

	if err := br.sqlc.AddBrand(ctx, param); err != nil {
		return err
	}
	return nil
}
