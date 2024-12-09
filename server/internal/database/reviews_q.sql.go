// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: reviews_q.sql

package database

import (
	"context"
	"database/sql"
	"encoding/json"

	"github.com/google/uuid"
)

const createReview = `-- name: CreateReview :exec
INSERT INTO reviews (user_id, sku_id, order_id, rating, comment) VALUES ($1, $2, $3, $4, $5)
`

type CreateReviewParams struct {
	UserID  uuid.UUID
	SkuID   uuid.UUID
	OrderID uuid.UUID
	Rating  float64
	Comment json.RawMessage
}

func (q *Queries) CreateReview(ctx context.Context, arg CreateReviewParams) error {
	_, err := q.db.ExecContext(ctx, createReview,
		arg.UserID,
		arg.SkuID,
		arg.OrderID,
		arg.Rating,
		arg.Comment,
	)
	return err
}

const deleteReviewById = `-- name: DeleteReviewById :exec
DELETE FROM reviews
WHERE id = $1 AND user_id = $2
`

type DeleteReviewByIdParams struct {
	ID     uuid.UUID
	UserID uuid.UUID
}

func (q *Queries) DeleteReviewById(ctx context.Context, arg DeleteReviewByIdParams) error {
	_, err := q.db.ExecContext(ctx, deleteReviewById, arg.ID, arg.UserID)
	return err
}

const getAllReviewsByProductId = `-- name: GetAllReviewsByProductId :many
SELECT r.id, r.sku_id, r.user_id, r.order_id, r.rating, r.comment, r.created_at, r.updated_at, u.full_name, u.avt
FROM reviews r
INNER JOIN skus s ON r.sku_id = s.id
INNER JOIN users u ON r.user_id = u.id
WHERE s.product_id = $1
ORDER BY r.created_at DESC
`

type GetAllReviewsByProductIdRow struct {
	ID        uuid.UUID
	SkuID     uuid.UUID
	UserID    uuid.UUID
	OrderID   uuid.UUID
	Rating    float64
	Comment   json.RawMessage
	CreatedAt sql.NullTime
	UpdatedAt sql.NullTime
	FullName  sql.NullString
	Avt       sql.NullString
}

func (q *Queries) GetAllReviewsByProductId(ctx context.Context, productID uuid.UUID) ([]GetAllReviewsByProductIdRow, error) {
	rows, err := q.db.QueryContext(ctx, getAllReviewsByProductId, productID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetAllReviewsByProductIdRow
	for rows.Next() {
		var i GetAllReviewsByProductIdRow
		if err := rows.Scan(
			&i.ID,
			&i.SkuID,
			&i.UserID,
			&i.OrderID,
			&i.Rating,
			&i.Comment,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.FullName,
			&i.Avt,
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

const getReviewById = `-- name: GetReviewById :one
SELECT id, sku_id, user_id, order_id, rating, comment, created_at, updated_at
FROM reviews
WHERE id = $1
`

func (q *Queries) GetReviewById(ctx context.Context, id uuid.UUID) (Review, error) {
	row := q.db.QueryRowContext(ctx, getReviewById, id)
	var i Review
	err := row.Scan(
		&i.ID,
		&i.SkuID,
		&i.UserID,
		&i.OrderID,
		&i.Rating,
		&i.Comment,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const updateReviewById = `-- name: UpdateReviewById :exec
UPDATE reviews
SET rating = $1, comment = $2
WHERE id = $3
`

type UpdateReviewByIdParams struct {
	Rating  float64
	Comment json.RawMessage
	ID      uuid.UUID
}

func (q *Queries) UpdateReviewById(ctx context.Context, arg UpdateReviewByIdParams) error {
	_, err := q.db.ExecContext(ctx, updateReviewById, arg.Rating, arg.Comment, arg.ID)
	return err
}
