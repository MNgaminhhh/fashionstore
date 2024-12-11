-- name: CreateProductVariant :exec
INSERT INTO product_variants (name, status, product_id) VALUES ($1, $2, $3);

-- name: GetProductVariantById :one
SELECT pv.name,
       pv.id,
       pv.status,
       pv.created_at,
       pv.updated_at,
       p.name as product_name,
       p.id as product_id
FROM product_variants pv
    LEFT JOIN products p ON pv.product_id = p.id
WHERE pv.id = $1;

-- name: GetAllProductVariants :many
SELECT
    pv.name,
    pv.id,
    pv.status,
    pv.created_at,
    pv.updated_at,
    p.name as product_name,
    p.id as product_id
FROM product_variants pv
LEFT JOIN products p ON pv.product_id = p.id
WHERE (pv.name ILIKE '%' || $1 || '%' OR $1 IS  NULL)
AND (pv.status = $2 OR $2 IS NULL)
AND (($3::text = '' OR $3 IS NULL) OR p.id = $3::UUID)
ORDER BY pv.updated_at DESC;

-- name: GetAllProductVariantsByProductId :many
SELECT pv.name, pv.id, pv.product_id
FROM product_variants pv
WHERE pv.product_id = $1;

-- name: DeleteProductVariantById :exec
DELETE FROM product_variants
WHERE id = $1;

-- name: UpdateProductVariant :exec
UPDATE product_variants
SET name = $1, status = $2
WHERE id = $3;

-- name: CreateVariantOptions :exec
INSERT INTO variant_options (name, product_variant_id, status)
VALUES ($1, $2, $3);

-- name: GetAllVariantOptionsByPvId :many
SELECT vo.id, vo.name, vo.status, vo.created_at, vo.updated_at, pv.name as product_variant_name
FROM variant_options vo
RIGHT JOIN product_variants pv ON vo.product_variant_id = pv.id
WHERE (vo.name ILIKE '%' || $1 || '%' OR $1 IS NULL)
    AND (vo.status = $2 OR $2 IS NULL)
    AND (pv.name ILIKE '%' || $3 || '%' OR $3 IS NULL)
    AND pv.id = $4
ORDER BY vo.updated_at DESC;


-- name: UpdateVariantOptionById :exec
UPDATE variant_options
SET name = $1, status = $2
WHERE id = $3;

-- name: DeleteVariantOptionById :exec
DELETE FROM variant_options
WHERE id = $1;

-- name: GetVariantOptionById :one
SELECT * FROM variant_options
WHERE id = $1;