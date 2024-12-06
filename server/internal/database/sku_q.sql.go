// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: sku_q.sql

package database

import (
	"context"
	"database/sql"
	"encoding/json"

	"github.com/google/uuid"
)

const createSKU = `-- name: CreateSKU :exec
INSERT INTO skus (id, product_id, in_stock, sku, price, offer, status, offer_start_date, offer_end_date)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
`

type CreateSKUParams struct {
	ID             uuid.UUID
	ProductID      uuid.UUID
	InStock        sql.NullInt16
	Sku            string
	Price          int64
	Offer          sql.NullInt32
	Status         SkuStatus
	OfferStartDate sql.NullTime
	OfferEndDate   sql.NullTime
}

func (q *Queries) CreateSKU(ctx context.Context, arg CreateSKUParams) error {
	_, err := q.db.ExecContext(ctx, createSKU,
		arg.ID,
		arg.ProductID,
		arg.InStock,
		arg.Sku,
		arg.Price,
		arg.Offer,
		arg.Status,
		arg.OfferStartDate,
		arg.OfferEndDate,
	)
	return err
}

const deleteSkuById = `-- name: DeleteSkuById :exec
DELETE FROM skus WHERE id = $1
`

func (q *Queries) DeleteSkuById(ctx context.Context, id uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, deleteSkuById, id)
	return err
}

const getAllSkuByProductId = `-- name: GetAllSkuByProductId :many
SELECT
    p.name AS product_name,
    p.vendor_id,
    s.id,
    s.price,
    s.sku,
    s.offer,
    s.in_stock,
    (s.price*(100-s.offer)/100) AS offer_price,
    jsonb_object_agg(
        COALESCE(pv.name, ''),
        COALESCE(vo.name, '')
    ) AS variant_options
FROM skus s
         LEFT JOIN products p ON p.id = s.product_id
         LEFT JOIN skus_variant_options so ON so.sku_id = s.id
         LEFT JOIN variant_options vo ON so.variant_option = vo.id
         LEFT JOIN product_variants pv ON vo.product_variant_id = pv.id
WHERE s.product_id = $1
GROUP BY p.name, p.vendor_id, s.price, s.sku, s.offer, s.in_stock, s.id
ORDER BY s.price ASC
`

type GetAllSkuByProductIdRow struct {
	ProductName    sql.NullString
	VendorID       uuid.NullUUID
	ID             uuid.UUID
	Price          int64
	Sku            string
	Offer          sql.NullInt32
	InStock        sql.NullInt16
	OfferPrice     int32
	VariantOptions json.RawMessage
}

func (q *Queries) GetAllSkuByProductId(ctx context.Context, productID uuid.UUID) ([]GetAllSkuByProductIdRow, error) {
	rows, err := q.db.QueryContext(ctx, getAllSkuByProductId, productID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetAllSkuByProductIdRow
	for rows.Next() {
		var i GetAllSkuByProductIdRow
		if err := rows.Scan(
			&i.ProductName,
			&i.VendorID,
			&i.ID,
			&i.Price,
			&i.Sku,
			&i.Offer,
			&i.InStock,
			&i.OfferPrice,
			&i.VariantOptions,
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

const getAllSkuOfVendor = `-- name: GetAllSkuOfVendor :many
SELECT
    p.name AS product_name,
    p.id AS product_id,
    p.vendor_id,
    s.id,
    s.price,
    s.sku,
    s.offer,
    s.offer_start_date,
    s.offer_end_date,
    (s.price*(100-s.offer)/100) AS offer_price,
    s.in_stock,
    jsonb_object_agg(
        COALESCE(pv.name, ''),
        COALESCE(vo.name, '')
    ) AS variant_options
FROM products p
        LEFT JOIN skus s ON p.id = s.product_id
        LEFT JOIN skus_variant_options so ON so.sku_id = s.id
        LEFT JOIN variant_options vo ON so.variant_option = vo.id
        LEFT JOIN product_variants pv ON vo.product_variant_id = pv.id
WHERE (p.vendor_id = $1)
AND (p.name ILIKE '%' || $2 || '%' OR $2 IS NULL)
AND (s.sku = $3 OR $3 = '')
AND (s.product_id  = COALESCE(NULLIF($4::text, '')::UUID, p.id) OR $4 IS NULL)
AND (s.price = $5 OR $5 = -1)
AND (s.offer = $6 OR $6 IS NULL)
AND ((s.price*(100-s.offer)/100) = $7 OR $7 = -1)
GROUP BY p.name, p.vendor_id, p.id, s.id, s.price, s.sku, s.offer, s.in_stock, s.updated_at, s.offer_start_date,
         s.offer_end_date
ORDER BY s.updated_at DESC
`

type GetAllSkuOfVendorParams struct {
	VendorID uuid.UUID
	Column2  sql.NullString
	Sku      string
	Column4  string
	Price    int64
	Offer    sql.NullInt32
	Price_2  int64
}

type GetAllSkuOfVendorRow struct {
	ProductName    string
	ProductID      uuid.UUID
	VendorID       uuid.UUID
	ID             uuid.NullUUID
	Price          sql.NullInt64
	Sku            sql.NullString
	Offer          sql.NullInt32
	OfferStartDate sql.NullTime
	OfferEndDate   sql.NullTime
	OfferPrice     int32
	InStock        sql.NullInt16
	VariantOptions json.RawMessage
}

func (q *Queries) GetAllSkuOfVendor(ctx context.Context, arg GetAllSkuOfVendorParams) ([]GetAllSkuOfVendorRow, error) {
	rows, err := q.db.QueryContext(ctx, getAllSkuOfVendor,
		arg.VendorID,
		arg.Column2,
		arg.Sku,
		arg.Column4,
		arg.Price,
		arg.Offer,
		arg.Price_2,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetAllSkuOfVendorRow
	for rows.Next() {
		var i GetAllSkuOfVendorRow
		if err := rows.Scan(
			&i.ProductName,
			&i.ProductID,
			&i.VendorID,
			&i.ID,
			&i.Price,
			&i.Sku,
			&i.Offer,
			&i.OfferStartDate,
			&i.OfferEndDate,
			&i.OfferPrice,
			&i.InStock,
			&i.VariantOptions,
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

const getSkuById = `-- name: GetSkuById :one
SELECT
    p.name AS product_name,
    p.vendor_id,
    s.id, s.product_id, s.in_stock, s.sku, s.price, s.status, s.offer, s.offer_start_date, s.offer_end_date, s.created_at, s.updated_at,
    (s.price*(100-s.offer)/100) AS offer_price,
    jsonb_object_agg(
            COALESCE(pv.name, ''),
            COALESCE(vo.name, '')
    ) AS variant_options
FROM skus s
         LEFT JOIN products p ON p.id = s.product_id
         LEFT JOIN skus_variant_options so ON so.sku_id = s.id
         LEFT JOIN variant_options vo ON so.variant_option = vo.id
         LEFT JOIN product_variants pv ON vo.product_variant_id = pv.id
WHERE s.id = $1
GROUP BY p.name, p.vendor_id, s.price, s.sku, s.offer, s.in_stock, s.id, offer_price
`

type GetSkuByIdRow struct {
	ProductName    sql.NullString
	VendorID       uuid.NullUUID
	ID             uuid.UUID
	ProductID      uuid.UUID
	InStock        sql.NullInt16
	Sku            string
	Price          int64
	Status         SkuStatus
	Offer          sql.NullInt32
	OfferStartDate sql.NullTime
	OfferEndDate   sql.NullTime
	CreatedAt      sql.NullTime
	UpdatedAt      sql.NullTime
	OfferPrice     int32
	VariantOptions json.RawMessage
}

func (q *Queries) GetSkuById(ctx context.Context, id uuid.UUID) (GetSkuByIdRow, error) {
	row := q.db.QueryRowContext(ctx, getSkuById, id)
	var i GetSkuByIdRow
	err := row.Scan(
		&i.ProductName,
		&i.VendorID,
		&i.ID,
		&i.ProductID,
		&i.InStock,
		&i.Sku,
		&i.Price,
		&i.Status,
		&i.Offer,
		&i.OfferStartDate,
		&i.OfferEndDate,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.OfferPrice,
		&i.VariantOptions,
	)
	return i, err
}

const updateSkuById = `-- name: UpdateSkuById :exec
UPDATE skus
SET sku = $1, offer = $2, in_stock = $3, price = $4
WHERE id = $5
`

type UpdateSkuByIdParams struct {
	Sku     string
	Offer   sql.NullInt32
	InStock sql.NullInt16
	Price   int64
	ID      uuid.UUID
}

func (q *Queries) UpdateSkuById(ctx context.Context, arg UpdateSkuByIdParams) error {
	_, err := q.db.ExecContext(ctx, updateSkuById,
		arg.Sku,
		arg.Offer,
		arg.InStock,
		arg.Price,
		arg.ID,
	)
	return err
}
