-- name: GetBrands :many
SELECT * FROM brands
WHERE
    visible = $1 OR $1 IS NULL
AND (name LIKE '%' || $2::text || '%' OR $2 = '')
ORDER BY updated_at DESC;

-- name: AddBrand :exec
INSERT INTO brands (name, visible, sequence, store_id, image) VALUES ($1, $2,$3,$4,$5);

-- name: UpdateBrand :exec
UPDATE brands
SET name = $1, visible = $2, sequence = $3, image = $4
WHERE id = $5;

-- name: GetBrandById :one
SELECT *
FROM brands
WHERE id = $1;

-- name: DeleteById :exec
DELETE FROM brands
WHERE id = $1;