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
		return response.ErrorResponse(c, response.ErrCodeUnauthorized, "You are not authorized to perform this action")
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
