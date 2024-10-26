package service

import (
	"backend/internal/database"
	"backend/internal/repository"
	"backend/pkg/response"
	"github.com/google/uuid"
)

type IVendorService interface {
	BecomeVendor(nVendor *database.Vendor) int
	UpdateVendorStatus(userId uuid.UUID, adminId uuid.UUID, status database.VendorsStatus) int
	GetVendor(userId uuid.UUID) (int, *database.Vendor)
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
		return response.ErrCodeInternal
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

func (vs *VendorService) GetVendor(userId uuid.UUID) (int, *database.Vendor) {
	vendor, err := vs.vendorRepository.GetVendor(userId)
	if err != nil {
		return response.ErrCodeNotFound, nil
	}
	return response.SuccessCode, vendor
}
