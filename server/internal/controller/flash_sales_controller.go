package controller

import (
	"backend/internal/database"
	"backend/internal/service"
	"backend/internal/validator"
	"backend/pkg/response"
	"github.com/labstack/echo"
)

type FlashSalesController struct {
	flashSalesService service.IFlashSalesService
}

func NewFlashSaleController(flashSalesService service.IFlashSalesService) *FlashSalesController {
	return &FlashSalesController{flashSalesService: flashSalesService}
}

func (fc *FlashSalesController) CreateFlashSales(c echo.Context) error {
	role := c.Get("role").(database.UserRole)
	if role != database.UserRoleAdmin {
		return response.ErrorResponse(c, response.ErrCodeInvalidRole, "create fail")
	}
	var reqParam validator.CreateFlashSaleValidator
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "create fail")
	}
	if err := c.Validate(reqParam); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}
	code := fc.flashSalesService.CreateFlashSale(reqParam.StartDate, reqParam.EndDate)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "create fail")
	}
	return response.SuccessResponse(c, code, "Tạo mới thành công!")
}

func (fc *FlashSalesController) GetFlashSales(c echo.Context) error {
	code, results := fc.flashSalesService.GetAllFlashSales()
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "get fail")
	}
	return response.SuccessResponse(c, code, results)
}
