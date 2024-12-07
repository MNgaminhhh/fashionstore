package controller

import (
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
