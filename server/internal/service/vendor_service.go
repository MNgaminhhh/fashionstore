package service

import (
	"backend/internal/database"
	"backend/internal/repository"
	"backend/pkg/response"
)

type IVendorService interface {
	BecomeVendor(nVendor *database.Vendor) int
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
