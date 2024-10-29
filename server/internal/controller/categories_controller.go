package controller

import (
	"backend/internal/service"
	"backend/internal/validator"
	"backend/pkg/response"
	"github.com/labstack/echo"
)

type CategoryController struct {
	cateService service.ICategoriesService
}

func NewCategoryController(cateService service.ICategoriesService) *CategoryController {
	return &CategoryController{cateService}
}

func (cc *CategoryController) AddNewCategory(c echo.Context) error {
	var reqParam validator.AddCategoryRequest
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "Add new cate fail")
	}
	if err := c.Validate(reqParam); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}
	code := cc.cateService.AddNewCategory(reqParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "Add new cate fail")
	}
	return response.SuccessResponse(c, code, "Thêm mới thành công!")
}

func (cc *CategoryController) AddSubCate(c echo.Context) error {
	var reqParam validator.AddSubCateRequest
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "Add new sub cate fail")
	}
	if err := c.Validate(reqParam); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}
	code := cc.cateService.AddSubCate(reqParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "Add new sub cate fail")
	}
	return response.SuccessResponse(c, code, "Thêm mới thành công!")
}
