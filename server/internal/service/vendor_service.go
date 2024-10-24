package service

import "backend/internal/repository"

type IVendorService interface{}

type VendorService struct {
	repository.IVendorRepository
}

func NewVendorService(repository repository.IVendorRepository) IVendorService {
	return &VendorService{repository}
}
