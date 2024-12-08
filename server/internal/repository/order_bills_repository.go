package repository

import (
	"backend/global"
	"backend/internal/database"
	"backend/internal/validator"
	"database/sql"
	"github.com/google/uuid"
)

type IOrderBillsRepository interface {
	GetAllOrderBillsOfVendor(vendorId uuid.UUID, filterParam validator.FilterBillValidator) ([]database.SkusOrderBill, error)
	GetAllSkuOfOrderBill(orderId uuid.UUID) ([]database.SkusOrderBill, error)
	CreateOrderBill(bill database.OrderBill) error
	CreateSkuOrderBill(skuOrderBill database.SkusOrderBill) error
	UpdateOrderBillOfVendor(vendorId uuid.UUID, orderId uuid.UUID, isPrepared bool) error
	UpdateOrderBillStatus(orderId uuid.UUID, status database.OrderStatus) error
	DeleteOrderBill(id uuid.UUID) error
}

type OrderBillsRepository struct {
	sqlc *database.Queries
}

func (o OrderBillsRepository) UpdateOrderBillStatus(orderId uuid.UUID, status database.OrderStatus) error {
	param := database.UpdateStatusOrderBillParams{
		OrderStatus: database.NullOrderStatus{
			OrderStatus: status,
			Valid:       true,
		},
		ID: orderId,
	}
	err := o.sqlc.UpdateStatusOrderBill(ctx, param)
	return err
}

func (o OrderBillsRepository) GetAllSkuOfOrderBill(orderId uuid.UUID) ([]database.SkusOrderBill, error) {
	param := database.GetAllSkusByOrderIdParams{
		OrderID:    orderId,
		IsPrepared: sql.NullBool{},
	}
	results, err := o.sqlc.GetAllSkusByOrderId(ctx, param)
	if err != nil {
		return nil, err
	}
	return results, nil
}

func (o OrderBillsRepository) UpdateOrderBillOfVendor(vendorId uuid.UUID, orderId uuid.UUID, isPrepared bool) error {
	param := database.UpdateOrderBillsOfVendorParams{
		IsPrepared: sql.NullBool{
			Bool:  isPrepared,
			Valid: true,
		},
		VendorID: vendorId,
		OrderID:  orderId,
	}
	err := o.sqlc.UpdateOrderBillsOfVendor(ctx, param)
	return err
}

func (o OrderBillsRepository) GetAllOrderBillsOfVendor(vendorId uuid.UUID, filterParam validator.FilterBillValidator) ([]database.SkusOrderBill, error) {
	param := database.GetAllOrderBillsOfVendorParams{
		VendorID:   vendorId,
		IsPrepared: sql.NullBool{},
	}
	if filterParam.IsPrepared != nil {
		param.IsPrepared = sql.NullBool{
			Bool:  *filterParam.IsPrepared,
			Valid: true,
		}
	}
	results, err := o.sqlc.GetAllOrderBillsOfVendor(ctx, param)
	if err != nil {
		return nil, err
	}
	return results, nil
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
		VendorID:   skuOrderBill.VendorID,
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