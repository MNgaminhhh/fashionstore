package service

import (
	"backend/internal/database"
	"backend/internal/pg_error"
	"backend/internal/repository"
	"backend/internal/validator"
	"backend/pkg/response"
	"encoding/json"
	"errors"
	"github.com/google/uuid"
	"github.com/lib/pq"
)

type CartItemResponseData struct {
	Id              string          `json:"id"`
	SkuId           string          `json:"sku_id,omitempty"`
	Quantity        int             `json:"quantity,omitempty"`
	Price           int             `json:"price,omitempty"`
	OfferPrice      int             `json:"offer_price,omitempty"`
	TotalPrice      int             `json:"total_price,omitempty"`
	TotalOfferPrice int             `json:"total_offer_price,omitempty"`
	ProductImages   json.RawMessage `json:"product_image,omitempty"`
	Banner          string          `json:"banner,omitempty"`
}

type ICartService interface {
	AddNewSku(userId string, customParam validator.CreateCartItemValidator) int
	GetAllSkuItemInCartByUserId(userId string) (int, []CartItemResponseData)
	RemoveSkuItem(id string) int
}

type CartService struct {
	cartRepo repository.ICartRepository
}

func (c CartService) AddNewSku(userId string, customParam validator.CreateCartItemValidator) int {
	userUUID, _ := uuid.Parse(userId)
	skuId, _ := uuid.Parse(customParam.SkuId)
	cartItem, _ := c.cartRepo.GetSkuItemInCartBySkuId(skuId, userUUID)
	if cartItem == nil {
		err := c.cartRepo.CreateCartItem(userUUID, customParam)
		if err != nil {
			var pqErr *pq.Error
			if errors.As(err, &pqErr) {
				return pg_error.GetMessageError(pqErr)
			}
			return response.ErrCodeInternal
		}
	} else {
		cartItem.Quantity = cartItem.Quantity + int32(customParam.Quantity)
		err := c.cartRepo.UpdateSkuItemInCartById(cartItem)
		if err != nil {
			var pqErr *pq.Error
			if errors.As(err, &pqErr) {
				return pg_error.GetMessageError(pqErr)
			}
			return response.ErrCodeInternal
		}
	}
	return response.SuccessCode
}

func (c CartService) GetAllSkuItemInCartByUserId(userId string) (int, []CartItemResponseData) {
	userUUID, _ := uuid.Parse(userId)
	cartItems, err := c.cartRepo.GetAllSkuItemInCartByUserId(userUUID)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr), nil
		}
		return response.ErrCodeInternal, nil
	}
	var resData []CartItemResponseData
	for _, cartItem := range cartItems {
		resData = append(resData, *mapCartItemToResponseData(cartItem))
	}
	return response.SuccessCode, resData
}

func (c CartService) RemoveSkuItem(id string) int {
	cartItemId, _ := uuid.Parse(id)
	err := c.cartRepo.DeleteCartItemById(cartItemId)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr)
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func mapCartItemToResponseData(cartItem database.GetAllSkuItemInCartByUserIdRow) *CartItemResponseData {
	return &CartItemResponseData{
		Id:              cartItem.ID.String(),
		SkuId:           cartItem.SkuID.String(),
		Quantity:        int(cartItem.Quantity),
		Price:           int(cartItem.Price),
		OfferPrice:      int(cartItem.OfferPrice),
		TotalPrice:      int(cartItem.Price) * int(cartItem.Quantity),
		TotalOfferPrice: int(cartItem.OfferPrice) * int(cartItem.Quantity),
		ProductImages:   cartItem.Images,
		Banner:          cartItem.Banner,
	}
}

func NewCartService(cartRepo repository.ICartRepository) ICartService {
	return &CartService{cartRepo: cartRepo}
}
