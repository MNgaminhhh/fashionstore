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
INSERT INTO categories (name, name_code, icon, component) Values ($1, $2, $3, $4)
`

type AddCategoryParams struct {
	Name      string
	NameCode  string
	Icon      sql.NullString
	Component NullComponentsType
}

func (q *Queries) AddCategory(ctx context.Context, arg AddCategoryParams) error {
	_, err := q.db.ExecContext(ctx, addCategory,
		arg.Name,
		arg.NameCode,
		arg.Icon,
		arg.Component,
	)
	return err
}

const getFullCategories = `-- name: GetFullCategories :many
SELECT
    c.id AS category_id,
    c.name AS category_name,
    c.name_code AS category_name_code,
    sc.name AS sub_category_name,
    sc.url AS sub_category_name_code,
    cc.name AS child_category_name,
    cc.url AS child_category_name_code
FROM
    categories c
        LEFT JOIN
    sub_categories sc ON c.id = sc.category_id
        LEFT JOIN
    child_categories cc ON sc.id = cc.sub_category_id
`

type GetFullCategoriesRow struct {
	CategoryID            uuid.UUID
	CategoryName          string
	CategoryNameCode      string
	SubCategoryName       sql.NullString
	SubCategoryNameCode   sql.NullString
	ChildCategoryName     sql.NullString
	ChildCategoryNameCode sql.NullString
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
			&i.CategoryNameCode,
			&i.SubCategoryName,
			&i.SubCategoryNameCode,
			&i.ChildCategoryName,
			&i.ChildCategoryNameCode,
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
