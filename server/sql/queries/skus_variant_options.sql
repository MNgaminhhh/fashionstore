-- name: CreateSkuVariantOption :exec
INSERT INTO skus_variant_options (sku_id, variant_option) VALUES ($1, $2);

-- name: CheckExistVariantOptions :one
SELECT check_unique_variant_combination($1::UUID[]) AS exists;