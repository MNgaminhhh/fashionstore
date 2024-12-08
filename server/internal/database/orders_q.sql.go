// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: orders_q.sql

package database

import (
	"context"
	"database/sql"

	"github.com/google/uuid"
)

const createOrderBill = `-- name: CreateOrderBill :exec
INSERT INTO order_bills (
    id,
    order_code,
    product_total,
    shipping_fee,
    product_discount,
    shipping_discount,
    total_bill,
    user_id,
    delivery_info_id
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
`

type CreateOrderBillParams struct {
	ID               uuid.UUID
	OrderCode        string
	ProductTotal     int64
	ShippingFee      int64
	ProductDiscount  sql.NullInt64
	ShippingDiscount sql.NullInt64
	TotalBill        int64
	UserID           uuid.UUID
	DeliveryInfoID   uuid.UUID
}

func (q *Queries) CreateOrderBill(ctx context.Context, arg CreateOrderBillParams) error {
	_, err := q.db.ExecContext(ctx, createOrderBill,
		arg.ID,
		arg.OrderCode,
		arg.ProductTotal,
		arg.ShippingFee,
		arg.ProductDiscount,
		arg.ShippingDiscount,
		arg.TotalBill,
		arg.UserID,
		arg.DeliveryInfoID,
	)
	return err
}

const createOrderBillSku = `-- name: CreateOrderBillSku :exec
INSERT INTO skus_order_bills (sku_id, order_id, vendor_id, quantity, price, offer_price)
VALUES ($1, $2, $3,$4, $5, $6)
`

type CreateOrderBillSkuParams struct {
	SkuID      uuid.UUID
	OrderID    uuid.UUID
	VendorID   uuid.UUID
	Quantity   int32
	Price      int64
	OfferPrice int64
}

func (q *Queries) CreateOrderBillSku(ctx context.Context, arg CreateOrderBillSkuParams) error {
	_, err := q.db.ExecContext(ctx, createOrderBillSku,
		arg.SkuID,
		arg.OrderID,
		arg.VendorID,
		arg.Quantity,
		arg.Price,
		arg.OfferPrice,
	)
	return err
}

const deleteOrderBill = `-- name: DeleteOrderBill :exec
DELETE FROM order_bills
WHERE id = $1
`

func (q *Queries) DeleteOrderBill(ctx context.Context, id uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, deleteOrderBill, id)
	return err
}

const getAllOrderBillsOfVendor = `-- name: GetAllOrderBillsOfVendor :many
SELECT sku_id, quantity, order_id, vendor_id, is_prepared, price, offer_price, updated_at
FROM skus_order_bills
WHERE vendor_id = $1
AND (is_prepared = $2 OR $2 IS NULL)
ORDER BY updated_at
`

type GetAllOrderBillsOfVendorParams struct {
	VendorID   uuid.UUID
	IsPrepared sql.NullBool
}

func (q *Queries) GetAllOrderBillsOfVendor(ctx context.Context, arg GetAllOrderBillsOfVendorParams) ([]SkusOrderBill, error) {
	rows, err := q.db.QueryContext(ctx, getAllOrderBillsOfVendor, arg.VendorID, arg.IsPrepared)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []SkusOrderBill
	for rows.Next() {
		var i SkusOrderBill
		if err := rows.Scan(
			&i.SkuID,
			&i.Quantity,
			&i.OrderID,
			&i.VendorID,
			&i.IsPrepared,
			&i.Price,
			&i.OfferPrice,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}
