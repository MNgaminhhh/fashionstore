package controller

import (
	"backend/internal/service"
	"backend/internal/validator"
	"backend/pkg/response"
	"github.com/labstack/echo"
)

type ProductVariantsController struct {
	pvService service.IProductVariantsService
}

func NewProductVariantsController(pvService service.IProductVariantsService) *ProductVariantsController {
	return &ProductVariantsController{
		pvService: pvService,
	}
}

func (pc *ProductVariantsController) CreateProductVariantController(c echo.Context) error {
	var reqParam validator.CreateProductVariantValidator
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "Create Product Variant Fail")
	}
	if err := c.Validate(reqParam); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}
	code := pc.pvService.CreateProductVariant(reqParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "Create Product Variant Fail")
	}
	return response.SuccessResponse(c, code, "Tạo mới thành công!")
}

func (pc *ProductVariantsController) GetProductVariantById(c echo.Context) error {
	id := c.Param("id")
	code, pv := pc.pvService.GetProductVariantById(id)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "Get Product Variant Fail")
	}
	return response.SuccessResponse(c, code, pv)
}

func (pc *ProductVariantsController) GetAllProductVariants(c echo.Context) error {
	var reqParam validator.FilterProductVariantValidator
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "Filter Product Variant Fail")
	}
	if c.Param("status") != "" {
		if err := c.Validate(reqParam); err != nil {
			return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
		}
	}
	code, results := pc.pvService.GetAllProductVariants(reqParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "Get Product Variant Fail")
	}
	return response.SuccessResponse(c, code, results)
}

func (pc *ProductVariantsController) UpdateProductVariantById(c echo.Context) error {
	id := c.Param("id")
	var reqParam validator.UpdateProductVariantValidator
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "Update Product Variant Fail")
	}
	if c.Param("status") != "" {
		if err := c.Validate(reqParam); err != nil {
			return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
		}
	}
	code := pc.pvService.UpdateProductVariants(id, reqParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "Update Product Variant Fail")
	}
	return response.SuccessResponse(c, code, "Cập nhật mới thành công!")
}

func (pc *ProductVariantsController) DeleteProductVariantById(c echo.Context) error {
	id := c.Param("id")
	code := pc.pvService.DeleteProductVariants(id)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "Delete Product Variant Fail")
	}
	return response.SuccessResponse(c, code, "Delete Product Variant Success")
}
