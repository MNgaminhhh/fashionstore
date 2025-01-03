// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: categories_q.sql

package database

import (
	"context"
	"database/sql"

	"github.com/google/uuid"
)

const addCategory = `-- name: AddCategory :exec
INSERT INTO categories (name, name_code, icon, component, url) Values ($1, $2, $3, $4, $5)
`

type AddCategoryParams struct {
	Name      string
	NameCode  string
	Icon      sql.NullString
	Component NullComponentsType
	Url       sql.NullString
}

func (q *Queries) AddCategory(ctx context.Context, arg AddCategoryParams) error {
	_, err := q.db.ExecContext(ctx, addCategory,
		arg.Name,
		arg.NameCode,
		arg.Icon,
		arg.Component,
		arg.Url,
	)
	return err
}

const addChildCategory = `-- name: AddChildCategory :exec
INSERT INTO child_categories (sub_category_id, name, name_code, url)
VALUES (
$1,
        $2,
        $3,
        $4
)
`

type AddChildCategoryParams struct {
	SubCategoryID uuid.NullUUID
	Name          string
	NameCode      string
	Url           sql.NullString
}

func (q *Queries) AddChildCategory(ctx context.Context, arg AddChildCategoryParams) error {
	_, err := q.db.ExecContext(ctx, addChildCategory,
		arg.SubCategoryID,
		arg.Name,
		arg.NameCode,
		arg.Url,
	)
	return err
}

const addSubcategory = `-- name: AddSubcategory :exec
INSERT INTO sub_categories (category_id, name, name_code, component, url)
VALUES (
(SELECT categories.id FROM categories WHERE categories.name = $1),
$2,
        $3,
$4,
         $5
)
`

type AddSubcategoryParams struct {
	Name      string
	Name_2    string
	NameCode  string
	Component NullComponentsType
	Url       sql.NullString
}

func (q *Queries) AddSubcategory(ctx context.Context, arg AddSubcategoryParams) error {
	_, err := q.db.ExecContext(ctx, addSubcategory,
		arg.Name,
		arg.Name_2,
		arg.NameCode,
		arg.Component,
		arg.Url,
	)
	return err
}

const deleteCategoryById = `-- name: DeleteCategoryById :exec
DELETE FROM categories
WHERE id = $1
`

func (q *Queries) DeleteCategoryById(ctx context.Context, id uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, deleteCategoryById, id)
	return err
}

const deleteChildCategoryById = `-- name: DeleteChildCategoryById :exec
DELETE FROM child_categories
WHERE id = $1
`

func (q *Queries) DeleteChildCategoryById(ctx context.Context, id uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, deleteChildCategoryById, id)
	return err
}

const deleteSubCategoryById = `-- name: DeleteSubCategoryById :exec
DELETE FROM sub_categories
WHERE id = $1
`

func (q *Queries) DeleteSubCategoryById(ctx context.Context, id uuid.UUID) error {
	_, err := q.db.ExecContext(ctx, deleteSubCategoryById, id)
	return err
}

const findALlSubCategories = `-- name: FindALlSubCategories :many
SELECT sc.id, sc.category_id, sc.name, sc.name_code, sc.url, sc.status, sc.component, sc.created_at, sc.updated_at, c.name AS category_name
FROM sub_categories sc
         JOIN categories c ON sc.category_id = c.id
WHERE (sc.url ILIKE '%' || $1 || '%' OR $1 IS NULL )
  AND (sc.name ILIKE '%' || $2 || '%' OR $2 IS NULL )
  AND (sc.name_code ILIKE '%' || $3 || '%' OR $3 IS NULL )
  AND (sc.status = $4 OR $4 = -1)
  AND (c.name ILIKE '%' || $5 || '%' OR $5 IS NULL)
  AND (c.id = COALESCE(NULLIF($6::text, '')::UUID, c.id) OR $6 IS NULL)
ORDER BY sc.updated_at DESC
`

type FindALlSubCategoriesParams struct {
	Column1 sql.NullString
	Column2 sql.NullString
	Column3 sql.NullString
	Status  sql.NullInt32
	Column5 sql.NullString
	Column6 string
}

type FindALlSubCategoriesRow struct {
	ID           uuid.UUID
	CategoryID   uuid.UUID
	Name         string
	NameCode     string
	Url          sql.NullString
	Status       sql.NullInt32
	Component    NullComponentsType
	CreatedAt    sql.NullTime
	UpdatedAt    sql.NullTime
	CategoryName string
}

func (q *Queries) FindALlSubCategories(ctx context.Context, arg FindALlSubCategoriesParams) ([]FindALlSubCategoriesRow, error) {
	rows, err := q.db.QueryContext(ctx, findALlSubCategories,
		arg.Column1,
		arg.Column2,
		arg.Column3,
		arg.Status,
		arg.Column5,
		arg.Column6,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []FindALlSubCategoriesRow
	for rows.Next() {
		var i FindALlSubCategoriesRow
		if err := rows.Scan(
			&i.ID,
			&i.CategoryID,
			&i.Name,
			&i.NameCode,
			&i.Url,
			&i.Status,
			&i.Component,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.CategoryName,
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

const findAllCategories = `-- name: FindAllCategories :many
SELECT id, name, name_code, url, icon, status, component, created_at, updated_at FROM categories
WHERE (name ILIKE '%' || $1 || '%' OR $1 IS NULL)
  AND (name_code ILIKE '%' || $2 || '%' OR $2 IS NULL)
  AND (url ILIKE '%' || $3 || '%' OR $3 IS NULL)
  AND (status = $4 OR $4 = -1)
ORDER BY updated_at DESC
`

type FindAllCategoriesParams struct {
	Column1 sql.NullString
	Column2 sql.NullString
	Column3 sql.NullString
	Status  sql.NullInt32
}

func (q *Queries) FindAllCategories(ctx context.Context, arg FindAllCategoriesParams) ([]Category, error) {
	rows, err := q.db.QueryContext(ctx, findAllCategories,
		arg.Column1,
		arg.Column2,
		arg.Column3,
		arg.Status,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Category
	for rows.Next() {
		var i Category
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.NameCode,
			&i.Url,
			&i.Icon,
			&i.Status,
			&i.Component,
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

const findAllChildCategories = `-- name: FindAllChildCategories :many
SELECT cc.id, cc.sub_category_id, cc.name, cc.name_code, cc.url, cc.status, cc.created_at, cc.updated_at, sc.name AS sub_category_name
FROM child_categories cc
         JOIN sub_categories sc ON cc.sub_category_id = sc.id
WHERE (cc.url ILIKE '%' || $1 || '%' OR $1 IS NULL)
  AND (cc.name ILIKE '%' || $2 || '%' OR $2 IS NULL)
  AND (cc.name_code ILIKE '%' || $3 || '%' OR $3 IS NULL)
  AND (cc.status = $4 OR $4 = -1)
  AND (sc.name ILIKE '%' || $5 || '%' OR $5 IS NULL)
  AND (sc.id = COALESCE(NULLIF($6::text, '')::UUID, sc.id) OR $6 IS NULL)
ORDER BY cc.updated_at DESC
`

type FindAllChildCategoriesParams struct {
	Column1 sql.NullString
	Column2 sql.NullString
	Column3 sql.NullString
	Status  sql.NullInt32
	Column5 sql.NullString
	Column6 string
}

type FindAllChildCategoriesRow struct {
	ID              uuid.UUID
	SubCategoryID   uuid.NullUUID
	Name            string
	NameCode        string
	Url             sql.NullString
	Status          sql.NullInt32
	CreatedAt       sql.NullTime
	UpdatedAt       sql.NullTime
	SubCategoryName string
}

func (q *Queries) FindAllChildCategories(ctx context.Context, arg FindAllChildCategoriesParams) ([]FindAllChildCategoriesRow, error) {
	rows, err := q.db.QueryContext(ctx, findAllChildCategories,
		arg.Column1,
		arg.Column2,
		arg.Column3,
		arg.Status,
		arg.Column5,
		arg.Column6,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []FindAllChildCategoriesRow
	for rows.Next() {
		var i FindAllChildCategoriesRow
		if err := rows.Scan(
			&i.ID,
			&i.SubCategoryID,
			&i.Name,
			&i.NameCode,
			&i.Url,
			&i.Status,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.SubCategoryName,
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

const findCategoryById = `-- name: FindCategoryById :one
SELECT id, name, name_code, url, icon, status, component, created_at, updated_at
FROM categories
WHERE id = $1
`

func (q *Queries) FindCategoryById(ctx context.Context, id uuid.UUID) (Category, error) {
	row := q.db.QueryRowContext(ctx, findCategoryById, id)
	var i Category
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.NameCode,
		&i.Url,
		&i.Icon,
		&i.Status,
		&i.Component,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const findChildCategoryById = `-- name: FindChildCategoryById :one
SELECT cc.id, cc.sub_category_id, cc.name, cc.name_code, cc.url, cc.status, cc.created_at, cc.updated_at, sc.name AS sub_category_name, sc.id AS sub_category_id
FROM child_categories cc
         JOIN sub_categories sc ON cc.sub_category_id = sc.id
WHERE cc.id = $1
`

type FindChildCategoryByIdRow struct {
	ID              uuid.UUID
	SubCategoryID   uuid.NullUUID
	Name            string
	NameCode        string
	Url             sql.NullString
	Status          sql.NullInt32
	CreatedAt       sql.NullTime
	UpdatedAt       sql.NullTime
	SubCategoryName string
	SubCategoryID_2 uuid.UUID
}

func (q *Queries) FindChildCategoryById(ctx context.Context, id uuid.UUID) (FindChildCategoryByIdRow, error) {
	row := q.db.QueryRowContext(ctx, findChildCategoryById, id)
	var i FindChildCategoryByIdRow
	err := row.Scan(
		&i.ID,
		&i.SubCategoryID,
		&i.Name,
		&i.NameCode,
		&i.Url,
		&i.Status,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.SubCategoryName,
		&i.SubCategoryID_2,
	)
	return i, err
}

const findSubCategoryById = `-- name: FindSubCategoryById :one
SELECT sc.id, sc.category_id, sc.name, sc.name_code, sc.url, sc.status, sc.component, sc.created_at, sc.updated_at, c.name AS category_name
FROM sub_categories sc
JOIN categories c ON sc.category_id = c.id
WHERE sc.id = $1
`

type FindSubCategoryByIdRow struct {
	ID           uuid.UUID
	CategoryID   uuid.UUID
	Name         string
	NameCode     string
	Url          sql.NullString
	Status       sql.NullInt32
	Component    NullComponentsType
	CreatedAt    sql.NullTime
	UpdatedAt    sql.NullTime
	CategoryName string
}

func (q *Queries) FindSubCategoryById(ctx context.Context, id uuid.UUID) (FindSubCategoryByIdRow, error) {
	row := q.db.QueryRowContext(ctx, findSubCategoryById, id)
	var i FindSubCategoryByIdRow
	err := row.Scan(
		&i.ID,
		&i.CategoryID,
		&i.Name,
		&i.NameCode,
		&i.Url,
		&i.Status,
		&i.Component,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.CategoryName,
	)
	return i, err
}

const getFullCategories = `-- name: GetFullCategories :many
SELECT
    c.id AS category_id,
    c.name AS category_name,
    c.url AS category_url,
    c.icon AS category_icon,
    c.component AS category_component,
    sc.name AS sub_category_name,
    sc.url AS sub_category_url,
    cc.name AS child_category_name,
    cc.url AS child_category_url
FROM
    categories c 
        LEFT JOIN
    sub_categories sc ON c.id = sc.category_id AND sc."status" = 1
        LEFT JOIN
    child_categories cc ON sc.id = cc.sub_category_id AND cc."status" = 1
WHERE
    c."status" = 1
`

type GetFullCategoriesRow struct {
	CategoryID        uuid.UUID
	CategoryName      string
	CategoryUrl       sql.NullString
	CategoryIcon      sql.NullString
	CategoryComponent NullComponentsType
	SubCategoryName   sql.NullString
	SubCategoryUrl    sql.NullString
	ChildCategoryName sql.NullString
	ChildCategoryUrl  sql.NullString
}

func (q *Queries) GetFullCategories(ctx context.Context) ([]GetFullCategoriesRow, error) {
	rows, err := q.db.QueryContext(ctx, getFullCategories)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetFullCategoriesRow
	for rows.Next() {
		var i GetFullCategoriesRow
		if err := rows.Scan(
			&i.CategoryID,
			&i.CategoryName,
			&i.CategoryUrl,
			&i.CategoryIcon,
			&i.CategoryComponent,
			&i.SubCategoryName,
			&i.SubCategoryUrl,
			&i.ChildCategoryName,
			&i.ChildCategoryUrl,
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

const updateCategoryById = `-- name: UpdateCategoryById :exec
UPDATE categories
SET name = $1,
    name_code = $2,
    icon = $3,
    component = $4,
    status = $5
WHERE id = $6
`

type UpdateCategoryByIdParams struct {
	Name      string
	NameCode  string
	Icon      sql.NullString
	Component NullComponentsType
	Status    sql.NullInt32
	ID        uuid.UUID
}

func (q *Queries) UpdateCategoryById(ctx context.Context, arg UpdateCategoryByIdParams) error {
	_, err := q.db.ExecContext(ctx, updateCategoryById,
		arg.Name,
		arg.NameCode,
		arg.Icon,
		arg.Component,
		arg.Status,
		arg.ID,
	)
	return err
}

const updateChildCategoryById = `-- name: UpdateChildCategoryById :exec
UPDATE child_categories
SET name = $1,
    name_code = $2,
    sub_category_id = $3,
    status = $4
WHERE id = $5
`

type UpdateChildCategoryByIdParams struct {
	Name          string
	NameCode      string
	SubCategoryID uuid.NullUUID
	Status        sql.NullInt32
	ID            uuid.UUID
}

func (q *Queries) UpdateChildCategoryById(ctx context.Context, arg UpdateChildCategoryByIdParams) error {
	_, err := q.db.ExecContext(ctx, updateChildCategoryById,
		arg.Name,
		arg.NameCode,
		arg.SubCategoryID,
		arg.Status,
		arg.ID,
	)
	return err
}

const updateSubCategoryById = `-- name: UpdateSubCategoryById :exec
UPDATE sub_categories
SET name = $1,
    name_code = $2,
    component = $3,
    category_id = $4,
    status = $5
WHERE id = $6
`

type UpdateSubCategoryByIdParams struct {
	Name       string
	NameCode   string
	Component  NullComponentsType
	CategoryID uuid.UUID
	Status     sql.NullInt32
	ID         uuid.UUID
}

func (q *Queries) UpdateSubCategoryById(ctx context.Context, arg UpdateSubCategoryByIdParams) error {
	_, err := q.db.ExecContext(ctx, updateSubCategoryById,
		arg.Name,
		arg.NameCode,
		arg.Component,
		arg.CategoryID,
		arg.Status,
		arg.ID,
	)
	return err
}
