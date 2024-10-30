package controller

import (
	"backend/internal/database"
	"backend/internal/service"
	"backend/internal/validator"
	"backend/pkg/response"
	"github.com/google/uuid"
	"github.com/labstack/echo"
	"log"
)

type BrandsController struct {
	brandsService service.IBrandsService
}

func NewBrandsController(brandsService service.IBrandsService) *BrandsController {
	return &BrandsController{
		brandsService: brandsService,
	}
}

func (bc *BrandsController) GetBrands(c echo.Context) error {
	var reqParam validator.FilterBrandsRequest
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, err.Error())
	}
	log.Println(reqParam.Limit)
	code, brands := bc.brandsService.GetBrands(reqParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, response.ErrCodeInternal, "GetBrands fail")
	}
	return response.SuccessResponse(c, response.SuccessCode, brands)
}

func (bc *BrandsController) UpdateBrand(c echo.Context) error {
	role := c.Get("role").(database.UserRole)
	if role != database.UserRoleAdmin {
		return response.ErrorResponse(c, response.ErrCodeInvalidRole, "update brands fail")
	}
	var reqParam validator.UpdateBrandRequest
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, err.Error())
	}
	id := c.Param("id")
	log.Println(id)
	brandId, _ := uuid.Parse(id)
	code := bc.brandsService.UpdateBrand(reqParam, brandId)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "UpdateBrands fail")
	}
	return response.SuccessResponse(c, response.SuccessCode, "Cập nhật thành công!")
}

func (bc *BrandsController) GetBrandById(c echo.Context) error {
	id := c.Param("id")
	code, data := bc.brandsService.GetBrandById(id)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "GetBrandById fail")
	}
	return response.SuccessResponse(c, response.SuccessCode, data)
}
