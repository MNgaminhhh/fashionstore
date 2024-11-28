package controller

import (
	"backend/internal/database"
	"backend/internal/service"
	"backend/internal/validator"
	"backend/pkg/response"
	"github.com/labstack/echo"
	"log"
)

type SkusController struct {
	skusService service.ISkusService
}

func NewSkusController(skusService service.ISkusService) *SkusController {
	return &SkusController{
		skusService: skusService,
	}
}

func (sc *SkusController) CreateSku(c echo.Context) error {
	var reqParam validator.CreateSkuValidator
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "create fail")
	}
	if err := c.Validate(reqParam); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}
	code := sc.skusService.CreateSku(reqParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "create fail")
	}
	return response.SuccessResponse(c, code, "Tạo mới thành công!")
}

func (sc *SkusController) GetAllSkusOfVendor(c echo.Context) error {
	role := c.Get("role").(database.UserRole)
	if role != database.UserRoleVendors {
		return response.ErrorResponse(c, response.ErrCodeInvalidRole, "get fail")
	}
	vendorId := c.Get("vendorId").(string)
	log.Println(vendorId, vendorId)
	var filterParam validator.FilterSkuValidator
	if err := c.Bind(&filterParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "filter fail")
	}
	code, results := sc.skusService.GetAllSkusOfVendor(vendorId, filterParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "get fail")
	}
	return response.SuccessResponse(c, code, results)
}
