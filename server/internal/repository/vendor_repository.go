package repository

import (
	"backend/global"
	"backend/internal/database"
	"github.com/google/uuid"
)

type IVendorRepository interface {
	BecomeVendor(nVendor *database.Vendor) error
	UpdateStatus(userId, updatedBy uuid.UUID, status database.VendorsStatus) error
	GetVendor(userId uuid.UUID) (*database.Vendor, error)
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

func (vr *VendorRepository) UpdateStatus(userId, updatedBy uuid.UUID, status database.VendorsStatus) error {
	params := database.UpdateVendorStatusParams{
		Status: status,
		UpdatedBy: uuid.NullUUID{
			UUID:  updatedBy,
			Valid: true,
		},
		UserID: userId,
	}
	return vr.sqlc.UpdateVendorStatus(ctx, params)
}

func (vr *VendorRepository) GetVendor(userId uuid.UUID) (*database.Vendor, error) {
	vendor, err := vr.sqlc.GetVendorByUserId(ctx, userId)
	if err != nil {
		return nil, err
	}
	return &vendor, nil
}
