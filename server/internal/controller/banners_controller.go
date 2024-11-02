package controller

import (
	"backend/internal/database"
	"backend/internal/service"
	"backend/internal/validator"
	"backend/pkg/response"
	"github.com/labstack/echo"
)

type BannersController struct {
	bannerService service.IBannersService
}

func NewBannersController(bannerService service.IBannersService) *BannersController {
	return &BannersController{
		bannerService: bannerService,
	}
}

func (bc *BannersController) AddBanner(c echo.Context) error {
	role := c.Get("role").(database.UserRole)
	if role != database.UserRoleAdmin {
		return response.ErrorResponse(c, response.ErrCodeInvalidRole, "Add banner fail")
	}
	var reqParam validator.AddBannerRequest
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "Add banner fail")
	}
	if err := c.Validate(reqParam); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}
	code := bc.bannerService.AddBanner(reqParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "Add banner fail")
	}
	return response.SuccessResponse(c, code, "Thêm mới thành công")
}

func (bc *BannersController) GetActiveBanners(c echo.Context) error {
	code, data := bc.bannerService.GetActiveBanners()
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "Get active banner fail")
	}
	return response.SuccessResponse(c, code, data)
}

func (bc *BannersController) GetAllBanners(c echo.Context) error {
	code, data := bc.bannerService.GetAllBanners()
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "Get all banner fail")
	}
	return response.SuccessResponse(c, code, data)
}