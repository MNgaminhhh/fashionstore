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
	var reqParam validator.FilterUpdateBillValidator
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

func (oc *OrderBillsController) UpdateOrderBillOfVendor(c echo.Context) error {
	role := c.Get("role").(database.UserRole)
	if role != database.UserRoleVendors {
		return response.ErrorResponse(c, response.ErrCodeInvalidRole, "update fail")
	}
	vendorId := c.Get("vendorId").(string)
	orderId := c.Param("id")
	reqParam := validator.UpdateSkusOrderValidator{}
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "create fail")
	}
	if err := c.Validate(reqParam); err != nil {
		validateErr := response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
		if validateErr != nil {
			return validateErr
		}
	}
	code := oc.orderBillService.UpdateOrderBillOfVendor(vendorId, orderId, *reqParam.IsPrepared)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "update fail")
	}
	return response.SuccessResponse(c, code, "Cập nhật đơn hàng thành công!")
}

func (oc *OrderBillsController) GetAllOrderBillsOfAdmin(c echo.Context) error {
	role := c.Get("role").(database.UserRole)
	if role != database.UserRoleAdmin {
		return response.ErrorResponse(c, response.ErrCodeInvalidRole, "get fail")
	}
	filterParam := validator.FilterUpdateBillValidator{}
	if err := c.Bind(&filterParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "get fail")
	}
	if err := c.Validate(&filterParam); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}
	code, results := oc.orderBillService.GetAllOrderBillsOfAdmin(filterParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "get fail")
	}
	return response.SuccessResponse(c, code, results)
}

func (oc *OrderBillsController) UpdateOrderStatusByAdmin(c echo.Context) error {
	role := c.Get("role").(database.UserRole)
	if role != database.UserRoleAdmin {
		return response.ErrorResponse(c, response.ErrCodeInvalidRole, "update fail")
	}
	orderId := c.Param("id")
	var reqParam validator.FilterUpdateBillValidator
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "update fail")
	}
	if err := c.Validate(&reqParam); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}
	code := oc.orderBillService.UpdateOrderBillOfAdmin(orderId, *reqParam.OrderStatus)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "update fail")
	}
	return response.SuccessResponse(c, code, "Cập nhật đơn hàng thành công!")
}

func (oc *OrderBillsController) GetOrderBillById(c echo.Context) error {
	id := c.Param("id")
	code, result := oc.orderBillService.GetOrderBillById(id)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "get fail")
	}
	return response.SuccessResponse(c, code, result)
}
