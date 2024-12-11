package controller

import (
	"backend/internal/database"
	"backend/internal/service"
	"backend/internal/validator"
	"backend/pkg/response"
	"github.com/labstack/echo"
	"log"
)

type CouponsController struct {
	couponsService service.ICouponsService
}

func NewCouponsController(couponsService service.ICouponsService) *CouponsController {
	return &CouponsController{
		couponsService: couponsService,
	}
}

func (cc *CouponsController) CreateCondition(c echo.Context) error {
	role := c.Get("role").(database.UserRole)
	if role != database.UserRoleAdmin {
		return response.ErrorResponse(c, response.ErrCodeInvalidRole, "create fail")
	}
	var reqParam validator.CreateConditionValidator
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "create fail")
	}
	if err := c.Validate(reqParam); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}
	code := cc.couponsService.CreateCondition(reqParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "create fail")
	}
	return response.SuccessResponse(c, code, "Tạo mới thành công!")
}

func (cc *CouponsController) GetAllCondition(c echo.Context) error {
	var reqParam validator.FilterConditionValidator
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "create fail")
	}
	code, results := cc.couponsService.GetAllCondition(reqParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "get fail")
	}
	return response.SuccessResponse(c, code, results)
}

func (cc *CouponsController) GetAllCoupons(c echo.Context) error {
	var reqParam validator.FilterCouponsValidator
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "create fail")
	}
	if reqParam.Type != nil && *reqParam.Type != "" {
		if err := c.Validate(reqParam); err != nil {
			return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
		}
	}
	code, results := cc.couponsService.GetAllCoupon(reqParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "get fail")
	}
	return response.SuccessResponse(c, code, results)
}

func (cc *CouponsController) GetConditionById(c echo.Context) error {
	id := c.Param("id")
	code, result := cc.couponsService.GetConditionById(id)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "get fail")
	}
	return response.SuccessResponse(c, code, result)
}

func (cc *CouponsController) UpdateCondition(c echo.Context) error {
	role := c.Get("role").(database.UserRole)
	if role != database.UserRoleAdmin {
		return response.ErrorResponse(c, response.ErrCodeInvalidRole, "update fail")
	}
	id := c.Param("id")
	var reqParam validator.UpdateConditionValidator
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "update fail")
	}
	if err := c.Validate(reqParam); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}
	code := cc.couponsService.UpdateCondition(id, reqParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "update fail")
	}
	return response.SuccessResponse(c, code, "Cập nhật thành công!")
}

func (cc *CouponsController) DeleteCondition(c echo.Context) error {
	role := c.Get("role").(database.UserRole)
	if role != database.UserRoleAdmin {
		return response.ErrorResponse(c, response.ErrCodeInvalidRole, "delete fail")
	}
	id := c.Param("id")
	log.Println(id)
	code := cc.couponsService.DeleteCondition(c.Param("id"))
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "delete fail")
	}
	return response.SuccessResponse(c, code, "Xóa thành công!")
}

func (cc *CouponsController) CreateCoupon(c echo.Context) error {
	role := c.Get("role").(database.UserRole)
	if role != database.UserRoleAdmin {
		return response.ErrorResponse(c, response.ErrCodeInvalidRole, "update fail")
	}
	reqParam := validator.CreateCouponValidator{}
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "create fail")
	}
	if err := c.Validate(reqParam); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}
	code := cc.couponsService.CreateCoupon(reqParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "create fail")
	}
	return response.SuccessResponse(c, code, "Tạo mới thành công!")
}

func (cc *CouponsController) GetCouponById(c echo.Context) error {
	id := c.Param("id")
	code, result := cc.couponsService.GetCouponById(id)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "get fail")
	}
	return response.SuccessResponse(c, code, result)
}

func (cc *CouponsController) GetAllCouponsCanUse(c echo.Context) error {
	userId := c.Get("uuid").(string)
	code, results := cc.couponsService.GetAllCouponCanUseOfUser(userId)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "get fail")
	}
	return response.SuccessResponse(c, code, results)
}
func (cc *CouponsController) UpdateCouponStatus(c echo.Context) error {
	id := c.Param("id")
	reqParam := validator.UpdateCouponValidator{}
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "update fail")
	}
	if reqParam.Status == nil {
		return response.SuccessResponse(c, response.SuccessCode, "update fail")
	}
	code := cc.couponsService.UpdateCouponStatus(id, *reqParam.Status)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "get fail")
	}
	return response.SuccessResponse(c, code, "Cập nhật thành công!")
}

func (cc *CouponsController) UpdateCouponById(c echo.Context) error {
	role := c.Get("role").(database.UserRole)
	if role != database.UserRoleAdmin {
		return response.ErrorResponse(c, response.ErrCodeInvalidRole, "update fail")
	}
	id := c.Param("id")
	var reqParam validator.CreateCouponValidator
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "update fail")
	}
	if err := c.Validate(reqParam); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}
	code := cc.couponsService.UpdateCouponById(id, reqParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "update fail")
	}
	return response.SuccessResponse(c, code, "Cập nhật thành công!")
}
