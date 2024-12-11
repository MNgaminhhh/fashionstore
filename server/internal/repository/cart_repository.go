package repository

import (
	"backend/global"
	"backend/internal/database"
	"backend/internal/validator"
	"github.com/google/uuid"
)

type ICartRepository interface {
	CreateCartItem(userId uuid.UUID, customParam validator.CreateCartItemValidator) error
	GetAllSkuItemInCartByUserId(userId uuid.UUID) ([]database.GetAllSkuItemInCartByUserIdRow, error)
	GetSkuItemInCartById(id uuid.UUID) (*database.Cart, error)
	GetSkuItemInCartBySkuId(skuId uuid.UUID, userId uuid.UUID) (*database.Cart, error)
	UpdateSkuItemInCartById(cartItem *database.Cart) error
	DeleteCartItemById(id uuid.UUID) error
	DeleteCartItemBySkuIdAndUserId(skuId uuid.UUID, userId uuid.UUID) error
}

type CartRepository struct {
	sqlc *database.Queries
}

func (c CartRepository) CreateCartItem(userId uuid.UUID, customParam validator.CreateCartItemValidator) error {
	skuId, _ := uuid.Parse(customParam.SkuId)
	param := database.CreateCartItemParams{
		UserID:   userId,
		SkuID:    skuId,
		Quantity: int32(customParam.Quantity),
	}
	err := c.sqlc.CreateCartItem(ctx, param)
	return err
}

func (c CartRepository) GetAllSkuItemInCartByUserId(userId uuid.UUID) ([]database.GetAllSkuItemInCartByUserIdRow, error) {
	results, err := c.sqlc.GetAllSkuItemInCartByUserId(ctx, userId)
	if err != nil {
		return nil, err
	}
	return results, nil
}

func (c CartRepository) GetSkuItemInCartById(id uuid.UUID) (*database.Cart, error) {
	result, err := c.sqlc.GetSkuItemInCartById(ctx, id)
	if err != nil {
		return nil, err
	}
	return &result, nil
}

func (c CartRepository) GetSkuItemInCartBySkuId(skuId uuid.UUID, userId uuid.UUID) (*database.Cart, error) {
	param := database.GetSkuItemInCartBySkuIdParams{
		SkuID:  skuId,
		UserID: userId,
	}
	result, err := c.sqlc.GetSkuItemInCartBySkuId(ctx, param)
	if err != nil {
		return nil, err
	}
	return &result, nil
}

func (c CartRepository) UpdateSkuItemInCartById(cartItem *database.Cart) error {
	param := database.UpdateSkuItemInCartParams{
		Quantity: cartItem.Quantity,
		ID:       cartItem.ID,
	}
	err := c.sqlc.UpdateSkuItemInCart(ctx, param)
	return err
}

func (c CartRepository) DeleteCartItemById(id uuid.UUID) error {
	err := c.sqlc.DeleteSkuItemInCartById(ctx, id)
	return err
}

func (c CartRepository) DeleteCartItemBySkuIdAndUserId(skuId uuid.UUID, userId uuid.UUID) error {
	param := database.DeleteSkuItemInCartBySkuIdAndUserIdParams{
		SkuID:  skuId,
		UserID: userId,
	}
	err := c.sqlc.DeleteSkuItemInCartBySkuIdAndUserId(ctx, param)
	return err
}

func NewCartRepository() ICartRepository {
	return &CartRepository{
		sqlc: database.New(global.Mdb),
	}
}
