package controller

import (
	"backend/internal/database"
	"backend/internal/service"
	"backend/internal/validator"
	"backend/pkg/response"
	"github.com/labstack/echo"
)

type DeliveryInfoController struct {
	deliveryInfoService service.IDeliveryInfoService
}

func NewDeliveryInfoController(deliveryInfoService service.IDeliveryInfoService) *DeliveryInfoController {
	return &DeliveryInfoController{
		deliveryInfoService: deliveryInfoService,
	}
}

func (dr *DeliveryInfoController) CreateDeliveryInfo(c echo.Context) error {
	role := c.Get("role").(database.UserRole)
	if role != database.UserRoleCustomer {
		return response.ErrorResponse(c, response.ErrCodeInvalidRole, "create fail")
	}
	userId := c.Get("uuid").(string)
	var reqParam validator.CreateDeliveryInfoValidator
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "create fail")
	}
	if err := c.Validate(reqParam); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}
	code := dr.deliveryInfoService.CreateDeliveryInfo(userId, reqParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "create fail")
	}
	return response.SuccessResponse(c, code, "Tạo mới thành công!")
}

func (dr *DeliveryInfoController) GetAllDeliveryByUserId(c echo.Context) error {
	userId := c.Get("uuid").(string)
	code, results := dr.deliveryInfoService.GetAllDeliveryInfoByUserId(userId)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "get fail")
	}
	return response.SuccessResponse(c, code, results)
}

func (dr *DeliveryInfoController) GetDeliveryInfoById(c echo.Context) error {
	deliveryInfoId := c.Param("id")
	code, results := dr.deliveryInfoService.GetDeliveryInfoById(deliveryInfoId)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "get fail")
	}
	return response.SuccessResponse(c, code, results)
}

func (dr *DeliveryInfoController) UpdateDeliveryInfo(c echo.Context) error {
	deliveryInfoId := c.Param("id")
	var reqParam validator.UpdateDeliveryInfoValidator
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "update fail")
	}
	if err := c.Validate(reqParam); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}
	code := dr.deliveryInfoService.UpdateDeliveryInfo(deliveryInfoId, reqParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "update fail")
	}
	return response.SuccessResponse(c, code, "Cập nhật thành công!")
}

func (dr *DeliveryInfoController) DeleteDeliveryInfoById(c echo.Context) error {
	deliveryInfoId := c.Param("id")
	code := dr.deliveryInfoService.DeleteDeliveryInfoById(deliveryInfoId)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "delete fail")
	}
	return response.SuccessResponse(c, code, "Xóa thành công!")
}
