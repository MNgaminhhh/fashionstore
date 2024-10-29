-- name: GetFullCategories :many
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
    child_categories cc ON sc.id = cc.sub_category_id;

-- name: AddCategory :exec
INSERT INTO categories (name, name_code, icon, component) Values ($1, $2, $3, $4);
