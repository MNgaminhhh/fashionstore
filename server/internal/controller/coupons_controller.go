package controller

import (
	"backend/internal/database"
	"backend/internal/service"
	"backend/internal/validator"
	"backend/pkg/response"
	"github.com/labstack/echo"
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
