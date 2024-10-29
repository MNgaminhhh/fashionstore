package controller

import (
	"backend/internal/database"
	"backend/internal/service"
	"backend/internal/validator"
	"backend/pkg/response"
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
	role := c.Get("role").(database.UserRole)
	if role != database.UserRoleAdmin {
		return response.ErrorResponse(c, response.ErrCodeInvalidRole, "get brands fail")
	}
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
