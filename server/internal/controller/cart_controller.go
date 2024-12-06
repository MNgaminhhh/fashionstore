package controller

import (
	"backend/internal/service"
	"backend/internal/validator"
	"backend/pkg/response"
	"github.com/labstack/echo"
)

type CartController struct {
	cartService service.ICartService
}

func NewCartController(cartService service.ICartService) *CartController {
	return &CartController{cartService: cartService}
}

func (cc *CartController) AddNewItem(c echo.Context) error {
	userId := c.Get("uuid").(string)
	var reqParam validator.CreateCartItemValidator
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "add fail")
	}
	if err := c.Validate(reqParam); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}
	code := cc.cartService.AddNewSku(userId, reqParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "add fail")
	}
	return response.SuccessResponse(c, code, "Đã thêm sản phẩm vào giỏ hàng!")
}

func (cc *CartController) GetAllSkuItemInCart(c echo.Context) error {
	userId := c.Get("uuid").(string)
	code, results := cc.cartService.GetAllSkuItemInCartByUserId(userId)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "get fail")
	}
	return response.SuccessResponse(c, code, results)
}

func (cc *CartController) RemoveItem(c echo.Context) error {
	id := c.Param("id")
	code := cc.cartService.RemoveSkuItem(id)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "delete fail")
	}
	return response.SuccessResponse(c, code, "Đã bỏ sản phẩm khỏi giỏ hàng!")
}
