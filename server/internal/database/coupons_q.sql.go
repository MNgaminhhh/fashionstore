// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: coupons_q.sql

package database

import (
	"context"
	"time"

	"github.com/google/uuid"
)

const createCoupon = `-- name: CreateCoupon :exec
INSERT INTO coupons (
    id,
    name,
    code,
    quantity,
    start_date,
    end_date,
    type,
    discount,
    max_price
) VALUES ($1, $2, $3, $4, $5, $6,$7, $8, $9)
`

type CreateCouponParams struct {
	ID        uuid.UUID
	Name      string
	Code      string
	Quantity  int32
	StartDate time.Time
	EndDate   time.Time
	Type      DiscountType
	Discount  int32
	MaxPrice  int32
}

func (q *Queries) CreateCoupon(ctx context.Context, arg CreateCouponParams) error {
	_, err := q.db.ExecContext(ctx, createCoupon,
		arg.ID,
		arg.Name,
		arg.Code,
		arg.Quantity,
		arg.StartDate,
		arg.EndDate,
		arg.Type,
		arg.Discount,
		arg.MaxPrice,
	)
	return err
}

const deleteCoupon = `-- name: DeleteCoupon :exec
DELETE FROM coupons
WHERE id = $1
`

func (q *Queries) DeleteCoupon(ctx context.Context, id uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, deleteCoupon, id)
	return err
}
