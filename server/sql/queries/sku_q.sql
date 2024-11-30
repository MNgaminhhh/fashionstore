-- name: CreateSKU :exec
INSERT INTO skus (product_id, in_stock, sku, price, offer, variant_option_ids)
VALUES ($1, $2, $3, $4, $5, $6);

-- name: GetAllSkuOfVendor :many
SELECT
    p.name AS product_name,
    p.vendor_id,
    s.price,
    s.sku,
    s.offer,
    s.in_stock,
    jsonb_object_agg(COALESCE(pv.name, 'default_variant_name'), COALESCE(vo.name, '')) AS variant_options
FROM products p
         LEFT JOIN skus s ON p.id = s.product_id
         LEFT JOIN variant_options vo ON s.variant_option_ids @> ARRAY[vo.id]
         LEFT JOIN product_variants pv ON vo.product_variant_id = pv.id
WHERE (p.vendor_id = $1)
AND (p.name ILIKE '%' || $2 || '%' OR $2 IS NULL)
AND (s.sku = $3 OR $3 IS NULL)
GROUP BY p.name, p.vendor_id, s.price, s.sku, s.offer, s.in_stock, s.updated_at
ORDER BY s.updated_at DESC;


-- name: GetAllSkuByProductId :many
SELECT
    p.name AS product_name,
    p.vendor_id,
    s.price,
    s.sku,
    s.offer,
    s.in_stock,
    jsonb_object_agg(pv.name, vo.name) AS variant_options
FROM skus s
         LEFT JOIN products p ON p.id = s.product_id
         LEFT JOIN variant_options vo ON s.variant_option_ids @> ARRAY[vo.id]
         LEFT JOIN product_variants pv ON vo.product_variant_id = pv.id
WHERE s.product_id = $1
GROUP BY p.name, p.vendor_id, s.price, s.sku, s.offer, s.in_stock
ORDER BY s.price ASC;

-- name: UpdateSkuById :exec
UPDATE skus
SET sku = $1, offer = $2, in_stock = $3, price = $4, variant_option_ids = $5
WHERE id = $6;