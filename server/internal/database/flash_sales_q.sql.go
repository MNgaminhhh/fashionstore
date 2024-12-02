// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: flash_sales_q.sql

package database

import (
	"context"
	"database/sql"
	"time"

	"github.com/google/uuid"
)

const createFlashSaleItem = `-- name: CreateFlashSaleItem :exec
INSERT INTO flash_sales_items (flash_sales_id, product_id, show) VALUES ($1, $2, $3)
`

type CreateFlashSaleItemParams struct {
	FlashSalesID uuid.UUID
	ProductID    uuid.UUID
	Show         sql.NullBool
}

func (q *Queries) CreateFlashSaleItem(ctx context.Context, arg CreateFlashSaleItemParams) error {
	_, err := q.db.ExecContext(ctx, createFlashSaleItem, arg.FlashSalesID, arg.ProductID, arg.Show)
	return err
}

const createFlashSales = `-- name: CreateFlashSales :exec
INSERT INTO flash_sales (start_date, end_date) VALUES ($1, $2)
`

type CreateFlashSalesParams struct {
	StartDate time.Time
	EndDate   time.Time
}

func (q *Queries) CreateFlashSales(ctx context.Context, arg CreateFlashSalesParams) error {
	_, err := q.db.ExecContext(ctx, createFlashSales, arg.StartDate, arg.EndDate)
	return err
}

const deleteFlashSaleById = `-- name: DeleteFlashSaleById :exec
DELETE FROM flash_sales
WHERE id = $1
`

func (q *Queries) DeleteFlashSaleById(ctx context.Context, id uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, deleteFlashSaleById, id)
	return err
}

const deleteFlashSaleItemById = `-- name: DeleteFlashSaleItemById :exec
DELETE FROM flash_sales_items
WHERE id = $1
`

func (q *Queries) DeleteFlashSaleItemById(ctx context.Context, id uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, deleteFlashSaleItemById, id)
	return err
}

const getAllFlashSaleItemByFlashSaleId = `-- name: GetAllFlashSaleItemByFlashSaleId :many
SELECT f.id, f.flash_sales_id, f.product_id, f.show, f.created_at, f.updated_at, p.name
FROM flash_sales_items f
    LEFT JOIN products p ON f.product_id = p.id
WHERE flash_sales_id = $1
ORDER BY f.updated_at DESC
`

type GetAllFlashSaleItemByFlashSaleIdRow struct {
	ID           uuid.UUID
	FlashSalesID uuid.UUID
	ProductID    uuid.UUID
	Show         sql.NullBool
	CreatedAt    sql.NullTime
	UpdatedAt    sql.NullTime
	Name         sql.NullString
}

func (q *Queries) GetAllFlashSaleItemByFlashSaleId(ctx context.Context, flashSalesID uuid.UUID) ([]GetAllFlashSaleItemByFlashSaleIdRow, error) {
	rows, err := q.db.QueryContext(ctx, getAllFlashSaleItemByFlashSaleId, flashSalesID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetAllFlashSaleItemByFlashSaleIdRow
	for rows.Next() {
		var i GetAllFlashSaleItemByFlashSaleIdRow
		if err := rows.Scan(
			&i.ID,
			&i.FlashSalesID,
			&i.ProductID,
			&i.Show,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.Name,
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

const getAllFlashSales = `-- name: GetAllFlashSales :many
SELECT id, start_date, end_date, created_at, updated_at
FROM flash_sales
WHERE (DATE(start_date) = $1::DATE OR $1 = '0001-01-01')
  AND (DATE(end_date) = $2::DATE OR $2 = '0001-01-01')
ORDER BY updated_at DESC
`

type GetAllFlashSalesParams struct {
	Column1 time.Time
	Column2 time.Time
}

func (q *Queries) GetAllFlashSales(ctx context.Context, arg GetAllFlashSalesParams) ([]FlashSale, error) {
	rows, err := q.db.QueryContext(ctx, getAllFlashSales, arg.Column1, arg.Column2)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []FlashSale
	for rows.Next() {
		var i FlashSale
		if err := rows.Scan(
			&i.ID,
			&i.StartDate,
			&i.EndDate,
			&i.CreatedAt,
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

const getFlashSaleById = `-- name: GetFlashSaleById :one
SELECT id, start_date, end_date, created_at, updated_at FROM flash_sales
WHERE id = $1
`

func (q *Queries) GetFlashSaleById(ctx context.Context, id uuid.UUID) (FlashSale, error) {
	row := q.db.QueryRowContext(ctx, getFlashSaleById, id)
	var i FlashSale
	err := row.Scan(
		&i.ID,
		&i.StartDate,
		&i.EndDate,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getFlashSaleItemById = `-- name: GetFlashSaleItemById :one
SELECT f.id, f.flash_sales_id, f.product_id, f.show, f.created_at, f.updated_at, p.name
FROM flash_sales_items f
    LEFT JOIN products p ON f.product_id = p.id
WHERE f.id = $1
`

type GetFlashSaleItemByIdRow struct {
	ID           uuid.UUID
	FlashSalesID uuid.UUID
	ProductID    uuid.UUID
	Show         sql.NullBool
	CreatedAt    sql.NullTime
	UpdatedAt    sql.NullTime
	Name         sql.NullString
}

func (q *Queries) GetFlashSaleItemById(ctx context.Context, id uuid.UUID) (GetFlashSaleItemByIdRow, error) {
	row := q.db.QueryRowContext(ctx, getFlashSaleItemById, id)
	var i GetFlashSaleItemByIdRow
	err := row.Scan(
		&i.ID,
		&i.FlashSalesID,
		&i.ProductID,
		&i.Show,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.Name,
	)
	return i, err
}

const updateFlashSale = `-- name: UpdateFlashSale :exec
UPDATE flash_sales
SET start_date = $1, end_date = $2
WHERE id = $3
`

type UpdateFlashSaleParams struct {
	StartDate time.Time
	EndDate   time.Time
	ID        uuid.UUID
}

func (q *Queries) UpdateFlashSale(ctx context.Context, arg UpdateFlashSaleParams) error {
	_, err := q.db.ExecContext(ctx, updateFlashSale, arg.StartDate, arg.EndDate, arg.ID)
	return err
}

const updateFlashSaleItemById = `-- name: UpdateFlashSaleItemById :exec
UPDATE flash_sales_items
SET product_id = $1, show = $2
WHERE id = $3
`

type UpdateFlashSaleItemByIdParams struct {
	ProductID uuid.UUID
	Show      sql.NullBool
	ID        uuid.UUID
}

func (q *Queries) UpdateFlashSaleItemById(ctx context.Context, arg UpdateFlashSaleItemByIdParams) error {
	_, err := q.db.ExecContext(ctx, updateFlashSaleItemById, arg.ProductID, arg.Show, arg.ID)
	return err
}
