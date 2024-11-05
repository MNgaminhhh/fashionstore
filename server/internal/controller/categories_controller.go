package controller

import (
	"backend/internal/database"
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

func (cc *CategoryController) AddChildCate(c echo.Context) error {
	var reqParam validator.AddChildCateRequest
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "Add child cate fail")
	}
	if err := c.Validate(reqParam); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}
	code := cc.cateService.AddChildCate(reqParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "Add child cate fail")
	}
	return response.SuccessResponse(c, code, "Thêm mới thành công!!")
}

func (cc *CategoryController) GetFullCate(c echo.Context) error {
	code, data := cc.cateService.GetFullCate()
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "Không thể lấy full categories!!")
	}
	return response.SuccessResponse(c, code, data)
}

func (cc *CategoryController) GetAllCates(c echo.Context) error {
	var reqParam validator.FilterCategoryRequest
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "Get all cates fail")
	}
	if err := c.Validate(reqParam); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}
	code, data := cc.cateService.GetAllCate(&reqParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "Get all cates fail")
	}
	return response.SuccessResponse(c, code, data)
}

func (cc *CategoryController) GetCategoryById(c echo.Context) error {
	id := c.Param("id")
	code, data := cc.cateService.GetCateById(id)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "Get cate by id fail")
	}
	return response.SuccessResponse(c, code, data)
}

func (cc *CategoryController) DeleteCateById(c echo.Context) error {
	role := c.Get("role").(database.UserRole)
	if role != database.UserRoleAdmin {
		return response.ErrorResponse(c, response.ErrCodeInvalidRole, "Delete cate by id fail")
	}
	id := c.Param("id")
	code := cc.cateService.DeleteCateById(id)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "Delete cate by id fail")
	}
	return response.SuccessResponse(c, code, "Xóa thành công")
}

func (cc *CategoryController) UpdateCateById(c echo.Context) error {
	role := c.Get("role").(database.UserRole)
	if role != database.UserRoleAdmin {
		return response.ErrorResponse(c, response.ErrCodeInvalidRole, "Update cate by id fail")
	}
	id := c.Param("id")
	if id == "" {
		return response.ErrorResponse(c, response.ErrCodeCateNotFound, "Update cate by id fail")
	}
	var reqParam validator.UpdateCategoryRequest
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "Update cate by id fail")
	}
	if err := c.Validate(reqParam); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}
	code := cc.cateService.UpdateCateById(id, reqParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "Update cate by id fail")
	}
	return response.SuccessResponse(c, code, "Cập nhật thành công!!")
}
