package controller

import (
	"backend/internal/database"
	"backend/internal/service"
	"backend/internal/validator"
	"backend/pkg/response"
	"encoding/json"
	"github.com/labstack/echo"
	"io"
	"log"
	"net/http"
	"slices"
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
	code, result := oc.orderBillService.CreateBill(userId, reqParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "create fail")
	}
	if result != nil {
		return response.SuccessResponse(c, code, result)
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
	if filterParam.PayingMethod != nil {
		payingMethod := []string{"COD", "QR_CODE"}
		_, isValid := slices.BinarySearch(payingMethod, *filterParam.PayingMethod)
		if !isValid {
			return response.ErrorResponse(c, response.ErrCodeInvalidPayingMethod, "get fail")
		}
	}
	if filterParam.OrderCode != nil {
		orderCode := []string{"pending", "paying", "shipping", "delivered", "cancel"}
		_, isValid := slices.BinarySearch(orderCode, *filterParam.OrderCode)
		if !isValid {
			return response.ErrorResponse(c, response.ErrCodeInvalidOrderStatus, "get fail")
		}
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

func (oc *OrderBillsController) WebHookUrl(c echo.Context) error {
	body, err := io.ReadAll(c.Request().Body)
	if err != nil {
		log.Println("Lỗi đọc body:", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Không thể đọc nội dung body"})
	}
	var bodyMap map[string]interface{}
	if err = json.Unmarshal(body, &bodyMap); err != nil {
		return response.ErrorResponse(c, response.ErrCodeInternal, "fail")
	}
	data, ok := bodyMap["data"].(map[string]interface{})
	if !ok {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Dữ liệu không hợp lệ"})
	}
	orderCodeFloat, ok := data["orderCode"].(float64)
	if !ok {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Dữ liệu không hợp lệ"})
	}
	orderCode := int(orderCodeFloat)
	code := oc.orderBillService.CallBackFunction(int64(orderCode))
	return response.SuccessResponse(c, code, body)
}

func (oc *OrderBillsController) CancelPayment(c echo.Context) error {
	orderCode := c.Param("orderCode")
	code := oc.orderBillService.DeleteOrderBillByOrderCode(orderCode)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "delete fail")
	}
	return response.SuccessResponse(c, code, "Xóa đơn hàng thành công!")
}

func (oc *OrderBillsController) GetAllOrderBillsOfUser(c echo.Context) error {
	userId := c.Get("uuid").(string)
	var reqParam validator.FilterUpdateBillValidator
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "update fail")
	}
	code, results := oc.orderBillService.GetAllOrderBillOfUser(userId, reqParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "get fail")
	}
	return response.SuccessResponse(c, code, results)
}
