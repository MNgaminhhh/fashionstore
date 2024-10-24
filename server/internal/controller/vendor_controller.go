package controller

import "backend/internal/service"

type VendorController struct {
	vendorService service.IVendorService
}

func NewVendorController(vendorService service.IVendorService) *VendorController {
	return &VendorController{
		vendorService: vendorService,
	}
}
