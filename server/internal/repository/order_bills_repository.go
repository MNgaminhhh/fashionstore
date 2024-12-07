package repository

import (
	"backend/global"
	"backend/internal/database"
	"github.com/google/uuid"
)

type IOrderBillsRepository interface {
	CreateOrderBill(bill database.OrderBill) error
	CreateSkuOrderBill(skuOrderBill database.SkusOrderBill) error
	DeleteOrderBill(id uuid.UUID) error
}

type OrderBillsRepository struct {
	sqlc *database.Queries
}

func (o OrderBillsRepository) CreateOrderBill(bill database.OrderBill) error {
	param := database.CreateOrderBillParams{
		ID:               bill.ID,
		OrderCode:        bill.OrderCode,
		ProductTotal:     bill.ProductTotal,
		ShippingFee:      bill.ShippingFee,
		ProductDiscount:  bill.ProductDiscount,
		ShippingDiscount: bill.ShippingDiscount,
		TotalBill:        bill.TotalBill,
		UserID:           bill.UserID,
		DeliveryInfoID:   bill.DeliveryInfoID,
	}
	err := o.sqlc.CreateOrderBill(ctx, param)
	return err
}

func (o OrderBillsRepository) CreateSkuOrderBill(skuOrderBill database.SkusOrderBill) error {
	param := database.CreateOrderBillSkuParams{
		SkuID:      skuOrderBill.SkuID,
		OrderID:    skuOrderBill.OrderID,
		Quantity:   skuOrderBill.Quantity,
		Price:      skuOrderBill.Price,
		OfferPrice: skuOrderBill.OfferPrice,
	}
	err := o.sqlc.CreateOrderBillSku(ctx, param)
	return err
}

func (o OrderBillsRepository) DeleteOrderBill(id uuid.UUID) error {
	err := o.sqlc.DeleteOrderBill(ctx, id)
	return err
}

func NewOrderBillsRepository() IOrderBillsRepository {
	return &OrderBillsRepository{
		sqlc: database.New(global.Mdb),
	}
}
