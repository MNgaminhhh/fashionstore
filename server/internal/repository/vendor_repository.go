package repository

import (
	"backend/global"
	"backend/internal/database"
	"backend/internal/validator"
	"fmt"
	"github.com/google/uuid"
	"strings"
)

type IVendorRepository interface {
	BecomeVendor(nVendor *database.Vendor) error
	UpdateStatus(userId, updatedBy uuid.UUID, status database.VendorsStatus) error
	UpdateVendor(vendor *database.Vendor) error
	GetVendor(vendorId uuid.UUID) (*database.GetVendorByIdRow, error)
	GetAllVendors(customParams validator.FilterVendorRequest) ([]database.Vendor, error)
	GetVendorByUUID(userId uuid.UUID) (*database.Vendor, error)
}

type VendorRepository struct {
	sqlc *database.Queries
}

func (vr *VendorRepository) UpdateVendor(vendor *database.Vendor) error {
	param := database.UpdateVendorParams{
		UserID:      vendor.UserID,
		FullName:    vendor.FullName,
		Email:       vendor.Email,
		PhoneNumber: vendor.PhoneNumber,
		StoreName:   vendor.StoreName,
		Description: vendor.Description,
		Address:     vendor.Address,
		Banner:      vendor.Banner,
	}
	err := vr.sqlc.UpdateVendor(ctx, param)
	return err
}

func NewVendorRepository() IVendorRepository {
	return &VendorRepository{sqlc: database.New(global.Mdb)}
}

func (vr *VendorRepository) BecomeVendor(nVendor *database.Vendor) error {
	param := database.AddVendorParams{
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
	err := vr.sqlc.AddVendor(ctx, param)
	return err
}

func (vr *VendorRepository) UpdateStatus(userId, updatedBy uuid.UUID, status database.VendorsStatus) error {
	param := database.UpdateVendorStatusParams{
		Status: database.NullVendorsStatus{
			VendorsStatus: status,
			Valid:         true,
		},
		UpdatedBy: uuid.NullUUID{
			UUID:  updatedBy,
			Valid: true,
		},
		UserID: userId,
	}
	return vr.sqlc.UpdateVendorStatus(ctx, param)
}

func (vr *VendorRepository) GetVendor(vendorId uuid.UUID) (*database.GetVendorByIdRow, error) {
	vendor, err := vr.sqlc.GetVendorById(ctx, vendorId)
	if err != nil {
		return nil, err
	}
	return &vendor, nil
}

func (vr *VendorRepository) GetAllVendors(customParams validator.FilterVendorRequest) ([]database.Vendor, error) {
	param := database.GetAllVendorsParams{
		Column1: database.VendorsStatusNull,
		Column2: customParams.StoreName,
		Column3: customParams.FullName,
		Column4: customParams.Address,
		Column5: customParams.Description,
	}
	if customParams.Status != "" {
		param.Column1 = database.VendorsStatus(strings.ToLower(customParams.Status))
	}
	fmt.Printf("Params: %+v\n", param)
	vendors, err := vr.sqlc.GetAllVendors(ctx, param)
	if err != nil {
		return nil, err
	}
	return vendors, nil
}

func (vr *VendorRepository) GetVendorByUUID(userId uuid.UUID) (*database.Vendor, error) {
	vendor, err := vr.sqlc.GetVendorByUUID(ctx, userId)
	if err != nil {
		return nil, err
	}
	return &vendor, nil
}
