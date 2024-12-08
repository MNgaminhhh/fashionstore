package controller

import (
	"backend/internal/database"
	"backend/internal/service"
	"backend/internal/validator"
	"backend/pkg/response"
	"github.com/labstack/echo"
)

type OrderBillsController struct {
	orderBillService service.IOrderBillsService
}

func NewOrderBillsController(orderBillService service.IOrderBillsService) *OrderBillsController {
	return &OrderBillsController{
		orderBillService: orderBillService,
	}
}

func (oc *OrderBillsController) GetAllOrderBillsOfVendor(c echo.Context) error {
	role := c.Get("role").(database.UserRole)
	if role != database.UserRoleVendors {
		return response.ErrorResponse(c, response.ErrCodeInvalidRole, "get fail")
	}
	vendorId := c.Get("vendorId").(string)
	var reqParam validator.FilterBillValidator
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "get fail")
	}
	code, results := oc.orderBillService.GetAllOrderBillsOfVendor(vendorId, reqParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "get fail")
	}
	return response.SuccessResponse(c, code, results)
}

func (oc *OrderBillsController) CreateOrderBill(c echo.Context) error {
	userId := c.Get("uuid").(string)
	reqParam := validator.CreateBillValidator{}
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "create fail")
	}
	if err := c.Validate(reqParam); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}
	code := oc.orderBillService.CreateBill(userId, reqParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "create fail")
	}
	return response.SuccessResponse(c, code, "Tạo đơn hàng thành công!")
}
