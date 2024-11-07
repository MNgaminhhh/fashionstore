// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: banners_q.sql

package database

import (
	"context"
	"database/sql"

	"github.com/google/uuid"
)

const addBanner = `-- name: AddBanner :exec
INSERT INTO banners (title, banner_image, description, text, link, serial, status)
VALUES ($1,$2,$3,$4, $5, $6, $7)
`

type AddBannerParams struct {
	Title       string
	BannerImage string
	Description sql.NullString
	Text        string
	Link        sql.NullString
	Serial      sql.NullInt32
	Status      int32
}

func (q *Queries) AddBanner(ctx context.Context, arg AddBannerParams) error {
	_, err := q.db.ExecContext(ctx, addBanner,
		arg.Title,
		arg.BannerImage,
		arg.Description,
		arg.Text,
		arg.Link,
		arg.Serial,
		arg.Status,
	)
	return err
}

const deleteBannerById = `-- name: DeleteBannerById :exec
DELETE FROM banners
WHERE id = $1
`

func (q *Queries) DeleteBannerById(ctx context.Context, id uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, deleteBannerById, id)
	return err
}

const getAllBanners = `-- name: GetAllBanners :many
SELECT id, banner_image, title, description, text, link, serial, status, created_at, updated_at FROM banners
WHERE
    (title ILIKE '%' || $1 || '%' OR $1 IS NULL)
AND (description ILIKE '%' || $2 || '%' OR $2 IS NULL)
AND (text ILIKE '%' || $3 || '%' OR $3 IS NULL)
AND (link ILIKE '%' || $4 || '%' OR $4 IS NULL)
AND (serial = $5 OR $5 IS NULL)
AND (status = $6 OR $6 = -1)
ORDER BY updated_at DESC
`

type GetAllBannersParams struct {
	Column1 sql.NullString
	Column2 sql.NullString
	Column3 sql.NullString
	Column4 sql.NullString
	Serial  sql.NullInt32
	Status  int32
}

func (q *Queries) GetAllBanners(ctx context.Context, arg GetAllBannersParams) ([]Banner, error) {
	rows, err := q.db.QueryContext(ctx, getAllBanners,
		arg.Column1,
		arg.Column2,
		arg.Column3,
		arg.Column4,
		arg.Serial,
		arg.Status,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Banner
	for rows.Next() {
		var i Banner
		if err := rows.Scan(
			&i.ID,
			&i.BannerImage,
			&i.Title,
			&i.Description,
			&i.Text,
			&i.Link,
			&i.Serial,
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

const getBannerById = `-- name: GetBannerById :one
SELECT id, banner_image, title, description, text, link, serial, status, created_at, updated_at FROM banners
WHERE id = $1
`

func (q *Queries) GetBannerById(ctx context.Context, id uuid.UUID) (Banner, error) {
	row := q.db.QueryRowContext(ctx, getBannerById, id)
	var i Banner
	err := row.Scan(
		&i.ID,
		&i.BannerImage,
		&i.Title,
		&i.Description,
		&i.Text,
		&i.Link,
		&i.Serial,
		&i.Status,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getBannersByStatus = `-- name: GetBannersByStatus :many
SELECT id, banner_image, title, description, text, link, serial, status, created_at, updated_at FROM banners
WHERE status = $1
ORDER BY serial ASC
`

func (q *Queries) GetBannersByStatus(ctx context.Context, status int32) ([]Banner, error) {
	rows, err := q.db.QueryContext(ctx, getBannersByStatus, status)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Banner
	for rows.Next() {
		var i Banner
		if err := rows.Scan(
			&i.ID,
			&i.BannerImage,
			&i.Title,
			&i.Description,
			&i.Text,
			&i.Link,
			&i.Serial,
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

const updateBanner = `-- name: UpdateBanner :exec
UPDATE banners
SET title = $2, banner_image = $3, description = $4, text = $5, link = $6, serial = $7, status = $8
WHERE id = $1
`

type UpdateBannerParams struct {
	ID          uuid.UUID
	Title       string
	BannerImage string
	Description sql.NullString
	Text        string
	Link        sql.NullString
	Serial      sql.NullInt32
	Status      int32
}

func (q *Queries) UpdateBanner(ctx context.Context, arg UpdateBannerParams) error {
	_, err := q.db.ExecContext(ctx, updateBanner,
		arg.ID,
		arg.Title,
		arg.BannerImage,
		arg.Description,
		arg.Text,
		arg.Link,
		arg.Serial,
		arg.Status,
	)
	return err
}