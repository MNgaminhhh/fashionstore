-- name: GetBrands :many
SELECT * FROM brands
WHERE
    visible IS NOT DISTINCT FROM $1
AND name '%' || $2::text || '%' OR $2 = '';

-- name: AddBrand :exec
INSERT INTO brands (name, visible, sequence, store_id, image) VALUES ($1, $2,$3,$4,$5);

-- name: UpdateBrand :exec
UPDATE brands
SET name = $1, visible = $2, sequence = $3, image = $4
WHERE id = $5;