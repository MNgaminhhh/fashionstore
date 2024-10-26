package repository

import (
	"backend/global"
	"backend/internal/database"
	"backend/internal/params"
	"github.com/google/uuid"
	"log"
	"strings"
	"time"
)

type IVendorRepository interface {
	BecomeVendor(nVendor *database.Vendor) error
	UpdateStatus(userId, updatedBy uuid.UUID, status database.VendorsStatus) error
	GetVendor(userId uuid.UUID) (*database.Vendor, error)
	GetAllVendors(customParams params.GetAllVendorsParams) ([]database.Vendor, error)
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

func (vr *VendorRepository) GetAllVendors(customParams params.GetAllVendorsParams) ([]database.Vendor, error) {
	param := database.GetAllVendorsParams{
		Column1: database.VendorsStatusNull,
		Column2: "",
		Column3: time.Time{},
		Column4: time.Time{},
	}
	if customParams.Status != nil {
		param.Column1 = database.VendorsStatus(strings.ToLower(*customParams.Status))
	}
	if customParams.StartDate != nil {
		param.Column3 = *customParams.StartDate
	}
	if customParams.EndDate != nil {
		param.Column4 = *customParams.EndDate
	}
	if customParams.StoreName != nil {
		param.Column2 = *customParams.StoreName
	}
	log.Println("Params: ", param)
	vendors, err := vr.sqlc.GetAllVendors(ctx, param)
	if err != nil {
		return nil, err
	}
	return vendors, nil
}
