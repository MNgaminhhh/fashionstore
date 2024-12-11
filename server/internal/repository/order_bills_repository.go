package repository

import (
	"backend/global"
	"backend/internal/database"
	"backend/internal/validator"
	"database/sql"
	"github.com/google/uuid"
)

type IOrderBillsRepository interface {
	GetAllOrderBillsOfVendor(vendorId uuid.UUID, filterParam validator.FilterUpdateBillValidator) ([]database.SkusOrderBill, error)
	GetAllOrderBillsOfAdmin(filterParam validator.FilterUpdateBillValidator) ([]database.OrderBill, error)
	GetAllSkuOfOrderBill(orderId uuid.UUID) ([]database.SkusOrderBill, error)
	GetAllOrderBillsOfUser(userId uuid.UUID) ([]database.GetAllOrderBillsOfUserRow, error)
	GetOrderBillById(orderId uuid.UUID) (*database.GetOrderBillByIdRow, error)
	CreateOrderBill(bill database.OrderBill) error
	CreateSkuOrderBill(skuOrderBill database.SkusOrderBill) error
	UpdateOrderBillOfVendor(vendorId uuid.UUID, orderId uuid.UUID, isPrepared bool) error
	UpdateOrderBillStatus(orderId uuid.UUID, status database.OrderStatus) error
	UpdateOrderBillStatusByOrderCode(orderCode string, status database.OrderStatus) error
	DeleteOrderBill(id uuid.UUID) error
	DeleteOrderBillByOrderCode(orderCode string) error
}

type OrderBillsRepository struct {
	sqlc *database.Queries
}

func (o OrderBillsRepository) GetAllOrderBillsOfUser(userId uuid.UUID) ([]database.GetAllOrderBillsOfUserRow, error) {
	results, err := o.sqlc.GetAllOrderBillsOfUser(ctx, userId)
	if err != nil {
		return nil, err
	}
	return results, err
}

func (o OrderBillsRepository) UpdateOrderBillStatusByOrderCode(orderCode string, status database.OrderStatus) error {
	param := database.UpdateStatusOrderBillByOrderCodeParams{
		OrderStatus: database.NullOrderStatus{
			OrderStatus: status,
			Valid:       true,
		},
		OrderCode: orderCode,
	}
	err := o.sqlc.UpdateStatusOrderBillByOrderCode(ctx, param)
	return err
}

func (o OrderBillsRepository) DeleteOrderBillByOrderCode(orderCode string) error {
	err := o.sqlc.DeleteOrderBillByOrderCode(ctx, orderCode)
	return err
}

func (o OrderBillsRepository) GetOrderBillById(orderId uuid.UUID) (*database.GetOrderBillByIdRow, error) {
	result, err := o.sqlc.GetOrderBillById(ctx, orderId)
	if err != nil {
		return nil, err
	}
	return &result, nil
}

func (o OrderBillsRepository) GetAllOrderBillsOfAdmin(filterParam validator.FilterUpdateBillValidator) ([]database.OrderBill, error) {
	param := database.GetAllOrderBillsParams{
		OrderStatus:  database.NullOrderStatus{},
		OrderCode:    "",
		PayingMethod: database.NullPayingMethod{},
	}
	if filterParam.OrderStatus != nil {
		status := database.OrderStatus(*filterParam.OrderStatus)
		param.OrderStatus = database.NullOrderStatus{
			OrderStatus: status,
			Valid:       true,
		}
	}
	if filterParam.OrderCode != nil {
		param.OrderCode = *filterParam.OrderCode
	}
	results, err := o.sqlc.GetAllOrderBills(ctx, param)
	if err != nil {
		return nil, err
	}
	return results, nil
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

func (o OrderBillsRepository) GetAllOrderBillsOfVendor(vendorId uuid.UUID, filterParam validator.FilterUpdateBillValidator) ([]database.SkusOrderBill, error) {
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
		PayingMethod:     bill.PayingMethod,
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
