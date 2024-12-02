package controller

import (
	"backend/internal/database"
	"backend/internal/service"
	"backend/internal/validator"
	"backend/pkg/response"
	"github.com/labstack/echo"
	"log"
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
	reqParam := validator.FilterFlashSaleValidator{}
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "filter fail")
	}
	code, results := fc.flashSalesService.GetAllFlashSales(reqParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "get fail")
	}
	return response.SuccessResponse(c, code, results)
}

func (fc *FlashSalesController) UpdateFlashSales(c echo.Context) error {
	role := c.Get("role").(database.UserRole)
	if role != database.UserRoleAdmin {
		return response.ErrorResponse(c, response.ErrCodeInvalidRole, "update fail")
	}
	id := c.Param("id")
	reqParam := validator.UpdateFlashSaleValidator{}
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "update fail")
	}
	code := fc.flashSalesService.UpdateFlashSale(id, reqParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "update fail")
	}
	return response.SuccessResponse(c, code, "Cập nhật thành công!")
}

func (fc *FlashSalesController) GetFlashSalesByID(c echo.Context) error {
	id := c.Param("id")
	log.Println(id)
	code, result := fc.flashSalesService.GetFlashSaleById(id)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "flash sale not found")
	}
	return response.SuccessResponse(c, response.SuccessCode, result)
}

func (fc *FlashSalesController) DeleteFlashSales(c echo.Context) error {
	role := c.Get("role").(database.UserRole)
	if role != database.UserRoleAdmin {
		return response.ErrorResponse(c, response.ErrCodeInvalidRole, "delete fail")
	}
	id := c.Param("id")
	code := fc.flashSalesService.DeleteFlashSale(id)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "delete fail")
	}
	return response.SuccessResponse(c, code, "Xóa thành công!")
}
