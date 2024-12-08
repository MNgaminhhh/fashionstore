package controller

import (
	"backend/internal/database"
	"backend/internal/service"
	"backend/internal/validator"
	"backend/pkg/response"
	"github.com/google/uuid"
	"github.com/labstack/echo"
)

type ProductController struct {
	productService service.IProductService
}

func NewProductController(productService service.IProductService) *ProductController {
	return &ProductController{
		productService: productService,
	}
}

func (pc *ProductController) AddProduct(c echo.Context) error {
	role := c.Get("role").(database.UserRole)
	if role != database.UserRoleVendors {
		return response.ErrorResponse(c, response.ErrCodeInvalidRole, "create fail")
	}
	id := c.Get("vendorId").(string)
	vendorId, _ := uuid.Parse(id)
	var req validator.AddProductRequest
	if err := c.Bind(&req); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "Yêu cầu không hợp lệ")
	}

	if err := c.Validate(&req); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}

	code := pc.productService.AddProduct(req, vendorId)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "Thêm sản phẩm thất bại")
	}

	return response.SuccessResponse(c, code, "Thêm sản phẩm thành công")
}

// get ::::/products/:id
func (pc *ProductController) GetProductByID(c echo.Context) error {
	id := c.Param("id")
	code, data := pc.productService.GetProductByID(id)
	if code != response.SuccessCode {
		message := "Lấy thông tin sản phẩm thất bại"
		if code == response.ErrCodeProductNotFound {
			message = "Không tìm thấy sản phẩm"
		}
		return response.ErrorResponse(c, code, message)
	}
	return response.SuccessResponse(c, code, data)
}

func (pc *ProductController) ViewFullDetailOfProduct(c echo.Context) error {
	slug := c.Param("slug")
	code, data := pc.productService.ViewFullDetailOfProduct(slug)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "get fail")
	}
	return response.SuccessResponse(c, code, data)
}

func (pc *ProductController) UpdateProduct(c echo.Context) error {
	id := c.Param("id")
	var req validator.UpdateProductRequest
	if err := c.Bind(&req); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "yêu cầu không hợp lệ")
	}

	if err := c.Validate(&req); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}

	code := pc.productService.UpdateProduct(id, req)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "Cập nhật sản phẩm thất bại")
	}

	return response.SuccessResponse(c, code, "Cập nhật sản phẩm thành công")
}

// delete  ::::products/:id
func (pc *ProductController) DeleteProductByID(c echo.Context) error {
	id := c.Param("id")
	code := pc.productService.DeleteProductByID(id)
	if code != response.SuccessCode {
		message := "Xóa sản phẩm thất bại"
		if code == response.ErrCodeProductNotFound {
			message = "Không tìm thấy sản phẩm"
		}
		return response.ErrorResponse(c, code, message)
	}

	return response.SuccessResponse(c, code, "Xóa sản phẩm thành công")
}

// find all :::::::/products
func (pc *ProductController) ListProducts(c echo.Context) error {
	var filter validator.FilterProductRequest
	if err := c.Bind(&filter); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "Tham số truy vấn không hợp lệ")
	}

	if err := c.Validate(&filter); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}

	code, data := pc.productService.ListProducts(&filter)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "Danh sách sản phẩm thất bại")
	}

	return response.SuccessResponse(c, code, data)
}

func (pc *ProductController) ListProductsOfVendor(c echo.Context) error {
	role := c.Get("role").(database.UserRole)
	vendorStatus := c.Get("vendorStatus").(database.VendorsStatus)
	if role != database.UserRoleVendors || vendorStatus != database.VendorsStatusAccepted {
		return response.ErrorResponse(c, response.ErrCodeInvalidRole, "get fail")
	}
	vendorId := c.Get("vendorId").(string)
	var reqParam validator.FilterProductRequest
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "get fail")
	}
	reqParam.VendorId = &vendorId
	code, data := pc.productService.GetAllProductOfVendor(&reqParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "get fail")
	}
	return response.SuccessResponse(c, code, data)
}

func (pc *ProductController) GetFlashSaleProducts(c echo.Context) error {
	reqParam := validator.FilterProductRequest{}
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "get fail")
	}
	code, results := pc.productService.GetAllProductFlashSale(reqParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "get fail")
	}
	return response.SuccessResponse(c, code, results)
}
