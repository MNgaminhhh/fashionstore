package repository

import (
	"backend/global"
	"backend/internal/database"
	"backend/internal/validator"
	"fmt"
	"github.com/google/uuid"
	"log"
	"strings"
)

type IVendorRepository interface {
	BecomeVendor(nVendor *database.Vendor) error
	UpdateStatus(userId, updatedBy uuid.UUID, status database.VendorsStatus) error
	GetVendor(userId uuid.UUID) (*database.Vendor, error)
	GetAllVendors(customParams validator.FilterVendorRequest) ([]database.Vendor, error)
}

type VendorRepository struct {
	sqlc *database.Queries
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

func (vr *VendorRepository) GetVendor(userId uuid.UUID) (*database.Vendor, error) {
	vendor, err := vr.sqlc.GetVendorByUserId(ctx, userId)
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
		Column5: "",
	}
	if customParams.Status != "" {
		param.Column1 = database.VendorsStatus(strings.ToLower(customParams.Status))
	}
	if customParams.Description != "" {
		param.Column5 = fmt.Sprintf("%%%s%%", customParams.Description)
	}
	log.Println("Params: ", param)
	vendors, err := vr.sqlc.GetAllVendors(ctx, param)
	if err != nil {
		return nil, err
	}
	return vendors, nil
}
