// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: shipping_rules_q.sql

package database

import (
	"context"
	"database/sql"

	"github.com/google/uuid"
)

const createShippingRule = `-- name: CreateShippingRule :exec
INSERT INTO shipping_rules (name, min_order_cost, price, status)
VALUES ($1, $2,$3, $4)
`

type CreateShippingRuleParams struct {
	Name         string
	MinOrderCost int64
	Price        int32
	Status       sql.NullBool
}

func (q *Queries) CreateShippingRule(ctx context.Context, arg CreateShippingRuleParams) error {
	_, err := q.db.ExecContext(ctx, createShippingRule,
		arg.Name,
		arg.MinOrderCost,
		arg.Price,
		arg.Status,
	)
	return err
}

const deleteShippingRuleById = `-- name: DeleteShippingRuleById :exec
DELETE FROM shipping_rules
WHERE id = $1
`

func (q *Queries) DeleteShippingRuleById(ctx context.Context, id uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, deleteShippingRuleById, id)
	return err
}

const getAllShippingRules = `-- name: GetAllShippingRules :many
SELECT id, name, min_order_cost, price, status, created_at, updated_at
FROM shipping_rules
WHERE (name ILIKE '%' || $1 || '%' OR $1 IS NULL)
AND (status = COALESCE($2, status) OR $2 IS NULL)
AND (min_order_cost = $3 OR $3 = -1)
ORDER BY price ASC
`

type GetAllShippingRulesParams struct {
	Column1      sql.NullString
	Status       sql.NullBool
	MinOrderCost int64
}

func (q *Queries) GetAllShippingRules(ctx context.Context, arg GetAllShippingRulesParams) ([]ShippingRule, error) {
	rows, err := q.db.QueryContext(ctx, getAllShippingRules, arg.Column1, arg.Status, arg.MinOrderCost)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []ShippingRule
	for rows.Next() {
		var i ShippingRule
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.MinOrderCost,
			&i.Price,
			&i.Status,
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

const getShippingRuleById = `-- name: GetShippingRuleById :one
SELECT id, name, min_order_cost, price, status, created_at, updated_at
FROM shipping_rules
WHERE id = $1
`

func (q *Queries) GetShippingRuleById(ctx context.Context, id uuid.UUID) (ShippingRule, error) {
	row := q.db.QueryRowContext(ctx, getShippingRuleById, id)
	var i ShippingRule
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.MinOrderCost,
		&i.Price,
		&i.Status,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const updateShippingRuleById = `-- name: UpdateShippingRuleById :exec
UPDATE shipping_rules
SET name = $1, min_order_cost = $2, price = $3, status = $4
WHERE id = $5
`

type UpdateShippingRuleByIdParams struct {
	Name         string
	MinOrderCost int64
	Price        int32
	Status       sql.NullBool
	ID           uuid.UUID
}

func (q *Queries) UpdateShippingRuleById(ctx context.Context, arg UpdateShippingRuleByIdParams) error {
	_, err := q.db.ExecContext(ctx, updateShippingRuleById,
		arg.Name,
		arg.MinOrderCost,
		arg.Price,
		arg.Status,
		arg.ID,
	)
	return err
}
