-- name: CreateProductVariant :exec
INSERT INTO product_variants (name, status) VALUES ($1, $2);

-- name: GetProductVariantById :one
SELECT * FROM product_variants
WHERE id = $1;

-- name: GetAllProductVariants :many
SELECT * FROM product_variants
WHERE (name ILIKE '%' || $1 || '%' OR $1 IS NULL)
    AND (status = $2 OR $2 IS NULL)
ORDER BY updated_at DESC;

-- name: DeleteProductVariantById :exec
DELETE FROM product_variants
WHERE id = $1;

-- name: UpdateProductVariant :exec
UPDATE product_variants
SET name = $1, status = $2
WHERE id = $3;