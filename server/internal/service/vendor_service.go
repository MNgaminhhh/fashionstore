package service

import (
	"backend/internal/database"
	"backend/internal/params"
	"backend/internal/repository"
	"backend/pkg/response"
	"errors"
	"github.com/google/uuid"
	"github.com/lib/pq"
	"log"
	"time"
)

type ResponseVendorData struct {
	ID          string    `json:"id"`
	UserID      string    `json:"user_id"`
	FullName    string    `json:"full_name"`
	PhoneNumber string    `json:"phone_number"`
	StoreName   string    `json:"store_name"`
	Status      string    `json:"status"`
	Description string    `json:"description"`
	Address     string    `json:"address"`
	Banner      string    `json:"banner"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type IVendorService interface {
	BecomeVendor(nVendor *database.Vendor) int
	UpdateVendorStatus(userId uuid.UUID, adminId uuid.UUID, status database.VendorsStatus) int
	GetVendor(userId uuid.UUID) (int, *ResponseVendorData)
	GetAllVendors(customParams params.GetAllVendorsParams) (int, []ResponseVendorData)
}

type VendorService struct {
	vendorRepository repository.IVendorRepository
}

func NewVendorService(repository repository.IVendorRepository) IVendorService {
	return &VendorService{repository}
}

func (vs *VendorService) BecomeVendor(nVendor *database.Vendor) int {
	err := vs.vendorRepository.BecomeVendor(nVendor)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			if pqErr.Code == "23505" {
				log.Println("unique")
				if pqErr.Constraint == "vendors_email_key" {
					return response.ErrCodeEmailAlreadyUsed
				}
				if pqErr.Constraint == "vendors_phone_number_key" {
					return response.ErrPhoneNumberAlreadyUsed
				}
			}
			return response.ErrCodeInternal
		}
	}
	return response.SuccessCode
}

func (vs *VendorService) UpdateVendorStatus(userId uuid.UUID, adminId uuid.UUID, status database.VendorsStatus) int {
	err := vs.vendorRepository.UpdateStatus(userId, adminId, status)
	if err != nil {
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (vs *VendorService) GetVendor(userId uuid.UUID) (int, *ResponseVendorData) {
	vendor, err := vs.vendorRepository.GetVendor(userId)
	if err != nil {
		return response.ErrCodeNotFound, nil
	}
	return response.SuccessCode, MapVendorToResponse(vendor)
}

func (vs *VendorService) GetAllVendors(customParams params.GetAllVendorsParams) (int, []ResponseVendorData) {
	vendors, err := vs.vendorRepository.GetAllVendors(customParams)
	if err != nil {
		log.Fatal(err)
		return response.ErrCodeInternal, nil
	}
	responseData := make([]ResponseVendorData, len(vendors))
	for i, vendor := range vendors {
		responseData[i] = *MapVendorToResponse(&vendor)
	}
	return response.SuccessCode, responseData
}

func MapVendorToResponse(vendor *database.Vendor) *ResponseVendorData {
	return &ResponseVendorData{
		ID:          vendor.ID.String(),
		UserID:      vendor.UserID.String(),
		FullName:    vendor.FullName,
		PhoneNumber: vendor.PhoneNumber,
		StoreName:   vendor.StoreName,
		Status:      string(vendor.Status.VendorsStatus),
		Description: vendor.Description.String,
		Address:     vendor.Address,
		Banner:      vendor.Banner,
		CreatedAt:   vendor.CreatedAt.Time,
		UpdatedAt:   vendor.UpdatedAt.Time,
	}
}
