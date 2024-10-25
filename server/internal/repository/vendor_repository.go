package repository

import (
	"backend/global"
	"backend/internal/database"
)

type IVendorRepository interface {
	BecomeVendor(nVendor *database.Vendor) error
}

type VendorRepository struct {
	sqlc *database.Queries
}

func NewVendorRepository() IVendorRepository {
	return &VendorRepository{sqlc: database.New(global.Mdb)}
}

func (vr *VendorRepository) BecomeVendor(nVendor *database.Vendor) error {
	params := database.AddVendorParams{
		UserID:      nVendor.UserID,
		FullName:    nVendor.FullName,
		Email:       nVendor.Email,
		PhoneNumber: nVendor.PhoneNumber,
		StoreName:   nVendor.StoreName,
		Banner:      nVendor.Banner,
		Description: nVendor.Description,
		Address:     nVendor.Address,
		CreatedBy:   nVendor.CreatedBy,
		UpdatedBy:   nVendor.UpdatedBy,
	}
	err := vr.sqlc.AddVendor(ctx, params)
	return err
}
