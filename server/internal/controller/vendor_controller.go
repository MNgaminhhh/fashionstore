package controller

import (
	"backend/internal/database"
	"backend/internal/service"
	"backend/internal/validator"
	"backend/pkg/response"
	"database/sql"
	"github.com/google/uuid"
	"github.com/labstack/echo"
)

type VendorController struct {
	vendorService service.IVendorService
}

func NewVendorController(vendorService service.IVendorService) *VendorController {
	return &VendorController{
		vendorService: vendorService,
	}
}

func (vc *VendorController) BecomeVendor(c echo.Context) error {
	role := c.Get("role").(database.UserRole)
	if role != database.UserRoleCustomer {
		return response.ErrorResponse(c, response.ErrCodeInvalidRole, "Role must be customer")
	}
	id := c.Get("uuid").(string)
	userId, _ := uuid.Parse(id)
	var reqParams validator.BecomeVendorRequest
	if err := c.Bind(&reqParams); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, err.Error())
	}
	if err := c.Validate(reqParams); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}
	vendor := &database.Vendor{
		UserID:      userId,
		FullName:    reqParams.FullName,
		Email:       reqParams.Email,
		PhoneNumber: reqParams.PhoneNumber,
		StoreName:   reqParams.StoreName,
		Banner:      reqParams.Banner,
		Description: sql.NullString{
			String: reqParams.Description,
		},
		Address:   reqParams.Address,
		CreatedBy: uuid.NullUUID{UUID: userId, Valid: true},
		UpdatedBy: uuid.NullUUID{UUID: userId, Valid: true},
	}

	code := vc.vendorService.BecomeVendor(vendor)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "Become a vendor fail")
	}
	return response.SuccessResponse(c, code, "Become a vendor successfully")
}

func (vc *VendorController) UpdateVendorStatusByAdmin(c echo.Context) error {
	role := c.Get("role").(database.UserRole)
	if role != database.UserRoleAdmin {
		return response.ErrorResponse(c, response.ErrCodeInvalidRole, "Role must be admin")
	}
	id := c.Get("uuid").(string)
	adminId, _ := uuid.Parse(id)
	var reqParams validator.AdminUpdateVendorStatusRequest
	if err := c.Bind(&reqParams); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, err.Error())
	}
	if err := c.Validate(reqParams); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}
	userId, _ := uuid.Parse(reqParams.UserId)
	code := vc.vendorService.UpdateVendorStatus(userId, adminId, database.VendorsStatus(reqParams.Status))
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "Update a vendor fail")
	}
	return response.SuccessResponse(c, code, "Update a vendor successfully")
}

func (vc *VendorController) GetVendor(c echo.Context) error {
	id := c.Param("user_id")
	if id == "" {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "Vendor ID is empty")
	}
	userId, _ := uuid.Parse(id)
	code, vendor := vc.vendorService.GetVendor(userId)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "Get a vendor fail")
	}
	data := map[string]interface{}{
		"id":           vendor.ID,
		"user_id":      vendor.UserID,
		"full_name":    vendor.FullName,
		"email":        vendor.Email,
		"phone_number": vendor.PhoneNumber,
		"store_name":   vendor.StoreName,
		"banner":       vendor.Banner,
		"description":  vendor.Description.String,
		"status":       vendor.Status,
	}
	return response.SuccessResponse(c, code, data)
}
