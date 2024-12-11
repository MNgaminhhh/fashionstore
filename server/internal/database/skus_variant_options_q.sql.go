// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: skus_variant_options_q.sql

package database

import (
	"context"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

const checkExistVariantOptions = `-- name: CheckExistVariantOptions :one
SELECT check_unique_variant_combination($1::UUID[]) AS exists
`

func (q *Queries) CheckExistVariantOptions(ctx context.Context, dollar_1 []uuid.UUID) (bool, error) {
	row := q.db.QueryRowContext(ctx, checkExistVariantOptions, pq.Array(dollar_1))
	var exists bool
	err := row.Scan(&exists)
	return exists, err
}

const createSkuVariantOption = `-- name: CreateSkuVariantOption :exec
INSERT INTO skus_variant_options (sku_id, variant_option) VALUES ($1, $2)
`

type CreateSkuVariantOptionParams struct {
	SkuID         uuid.UUID
	VariantOption uuid.UUID
}

func (q *Queries) CreateSkuVariantOption(ctx context.Context, arg CreateSkuVariantOptionParams) error {
	_, err := q.db.ExecContext(ctx, createSkuVariantOption, arg.SkuID, arg.VariantOption)
	return err
}
