package repository

import (
	"backend/global"
	"backend/internal/database"
)

type IVendorRepository interface{}

type VendorRepository struct {
	sqlc *database.Queries
}

func NewVendorRepository() IVendorRepository {
	return &VendorRepository{sqlc: database.New(global.Mdb)}
}
