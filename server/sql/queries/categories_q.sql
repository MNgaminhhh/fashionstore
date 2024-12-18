-- name: GetFullCategories :many
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
    c."status" = 1;


-- name: AddCategory :exec
INSERT INTO categories (name, name_code, icon, component, url) Values ($1, $2, $3, $4, $5);


-- name: AddSubcategory :exec
INSERT INTO sub_categories (category_id, name, name_code, component, url)
VALUES (
(SELECT categories.id FROM categories WHERE categories.name = $1),
$2,
        $3,
$4,
         $5
);

-- name: AddChildCategory :exec
INSERT INTO child_categories (sub_category_id, name, name_code, url)
VALUES (
$1,
        $2,
        $3,
        $4
);

-- name: FindAllCategories :many
SELECT * FROM categories
WHERE (name ILIKE '%' || $1 || '%' OR $1 IS NULL)
  AND (name_code ILIKE '%' || $2 || '%' OR $2 IS NULL)
  AND (url ILIKE '%' || $3 || '%' OR $3 IS NULL)
  AND (status = $4 OR $4 = -1)
ORDER BY updated_at DESC;


-- name: FindCategoryById :one
SELECT *
FROM categories
WHERE id = $1;


-- name: UpdateCategoryById :exec
UPDATE categories
SET name = $1,
    name_code = $2,
    icon = $3,
    component = $4,
    status = $5
WHERE id = $6;

-- name: DeleteCategoryById :exec
DELETE FROM categories
WHERE id = $1;


-- name: FindALlSubCategories :many
SELECT sc.*, c.name AS category_name
FROM sub_categories sc
         JOIN categories c ON sc.category_id = c.id
WHERE (sc.url ILIKE '%' || $1 || '%' OR $1 IS NULL )
  AND (sc.name ILIKE '%' || $2 || '%' OR $2 IS NULL )
  AND (sc.name_code ILIKE '%' || $3 || '%' OR $3 IS NULL )
  AND (sc.status = $4 OR $4 = -1)
  AND (c.name ILIKE '%' || $5 || '%' OR $5 IS NULL)
  AND (c.id = COALESCE(NULLIF($6::text, '')::UUID, c.id) OR $6 IS NULL)
ORDER BY sc.updated_at DESC;

-- name: FindSubCategoryById :one
SELECT sc.*, c.name AS category_name
FROM sub_categories sc
JOIN categories c ON sc.category_id = c.id
WHERE sc.id = $1;


-- name: UpdateSubCategoryById :exec
UPDATE sub_categories
SET name = $1,
    name_code = $2,
    component = $3,
    category_id = $4,
    status = $5
WHERE id = $6;

-- name: DeleteSubCategoryById :exec
DELETE FROM sub_categories
WHERE id = $1;

-- name: FindAllChildCategories :many
SELECT cc.*, sc.name AS sub_category_name
FROM child_categories cc
         JOIN sub_categories sc ON cc.sub_category_id = sc.id
WHERE (cc.url ILIKE '%' || $1 || '%' OR $1 IS NULL)
  AND (cc.name ILIKE '%' || $2 || '%' OR $2 IS NULL)
  AND (cc.name_code ILIKE '%' || $3 || '%' OR $3 IS NULL)
  AND (cc.status = $4 OR $4 = -1)
  AND (sc.name ILIKE '%' || $5 || '%' OR $5 IS NULL)
  AND (sc.id = COALESCE(NULLIF($6::text, '')::UUID, sc.id) OR $6 IS NULL)
ORDER BY cc.updated_at DESC;

-- name: FindChildCategoryById :one
SELECT cc.*, sc.name AS sub_category_name, sc.id AS sub_category_id
FROM child_categories cc
         JOIN sub_categories sc ON cc.sub_category_id = sc.id
WHERE cc.id = $1;


-- name: UpdateChildCategoryById :exec
UPDATE child_categories
SET name = $1,
    name_code = $2,
    sub_category_id = $3,
    status = $4
WHERE id = $5;

-- name: DeleteChildCategoryById :exec
DELETE FROM child_categories
WHERE id = $1;
