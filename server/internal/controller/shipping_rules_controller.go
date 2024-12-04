package controller

import (
	"backend/internal/database"
	"backend/internal/service"
	"backend/internal/validator"
	"backend/pkg/response"
	"github.com/labstack/echo"
)

type ShippingRulesController struct {
	srService service.IShippingRulesService
}

func NewShippingRulesController(srService service.IShippingRulesService) *ShippingRulesController {
	return &ShippingRulesController{
		srService: srService,
	}
}

func (sc *ShippingRulesController) CreateShippingRule(c echo.Context) error {
	role := c.Get("role").(database.UserRole)
	if role != database.UserRoleAdmin {
		return response.ErrorResponse(c, response.ErrCodeInvalidRole, "create fail")
	}
	var reqParam validator.CreateShippingRuleValidator
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "create fail")
	}
	if err := c.Validate(reqParam); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}
	code := sc.srService.CreateShippingRule(reqParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "create fail")
	}
	return response.SuccessResponse(c, code, "Tạo mới thành công!")
}

func (sc *ShippingRulesController) GetAllShippingRules(c echo.Context) error {
	var reqParam validator.FilterUpdateShippingRuleValidator
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "create fail")
	}
	code, results := sc.srService.GetAllShippingRules(reqParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "get fail")
	}
	return response.SuccessResponse(c, code, results)
}

func (sc *ShippingRulesController) GetShippingRuleById(c echo.Context) error {
	id := c.Param("id")
	code, result := sc.srService.GetShippingRuleById(id)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "get fail")
	}
	return response.SuccessResponse(c, code, result)
}

func (sc *ShippingRulesController) UpdateShippingRule(c echo.Context) error {
	role := c.Get("role").(database.UserRole)
	if role != database.UserRoleAdmin {
		return response.ErrorResponse(c, response.ErrCodeInvalidRole, "update fail")
	}
	id := c.Param("id")
	reqParam := validator.FilterUpdateShippingRuleValidator{}
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "update fail")
	}
	code := sc.srService.UpdateShippingRuleById(id, reqParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "update fail")
	}
	return response.SuccessResponse(c, code, "Cập nhật thành công!")
}

func (sc *ShippingRulesController) DeleteShippingRuleById(c echo.Context) error {
	role := c.Get("role").(database.UserRole)
	if role != database.UserRoleAdmin {
		return response.ErrorResponse(c, response.ErrCodeInvalidRole, "delete fail")
	}
	id := c.Param("id")
	code := sc.srService.DeleteShippingRuleById(id)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "delete fail")
	}
	return response.SuccessResponse(c, code, "Xóa thành công!")
}
