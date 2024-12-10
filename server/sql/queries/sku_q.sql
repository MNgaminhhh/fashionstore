-- name: CreateSKU :exec
INSERT INTO skus (id, product_id, in_stock, sku, price, offer, status, offer_start_date, offer_end_date)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);

-- name: GetAllSkuOfVendor :many
SELECT
    p.name AS product_name,
    p.id AS product_id,
    p.vendor_id,
    s.id,
    s.price,
    s.sku,
    s.offer,
    s.status,
    s.offer_start_date,
    s.offer_end_date,
    (s.price*(100-s.offer)/100) AS offer_price,
    s.in_stock,
    jsonb_object_agg(
        COALESCE(pv.name, ''),
        COALESCE(vo.name, '')
    ) AS variant_options
FROM products p
        LEFT JOIN skus s ON p.id = s.product_id
        LEFT JOIN skus_variant_options so ON so.sku_id = s.id
        LEFT JOIN variant_options vo ON so.variant_option = vo.id
        LEFT JOIN product_variants pv ON vo.product_variant_id = pv.id
WHERE (p.vendor_id = $1)
AND (p.name ILIKE '%' || $2 || '%' OR $2 IS NULL)
AND (s.sku = $3 OR $3 = '')
AND (s.product_id  = COALESCE(NULLIF($4::text, '')::UUID, p.id) OR $4 IS NULL)
AND (s.price = $5 OR $5 = -1)
AND (s.offer = $6 OR $6 IS NULL)
AND ((s.price*(100-s.offer)/100) = $7 OR $7 = -1)
GROUP BY p.name, p.vendor_id, p.id, s.id, s.price, s.sku, s.offer, s.in_stock, s.updated_at, s.offer_start_date,
         s.offer_end_date, s.status
ORDER BY s.updated_at DESC;


-- name: GetAllSkuByProductId :many
SELECT
    p.name AS product_name,
    p.vendor_id,
    s.id,
    s.price,
    s.sku,
    s.offer,
    s.in_stock,
    s.status,
    (s.price*(100-s.offer)/100) AS offer_price,
    s.offer_start_date,
    s.offer_end_date,
    jsonb_object_agg(
        COALESCE(pv.name, ''),
        COALESCE(vo.name, '')
    ) AS variant_options
FROM skus s
         LEFT JOIN products p ON p.id = s.product_id
         LEFT JOIN skus_variant_options so ON so.sku_id = s.id
         LEFT JOIN variant_options vo ON so.variant_option = vo.id
         LEFT JOIN product_variants pv ON vo.product_variant_id = pv.id
WHERE s.product_id = $1
GROUP BY p.name, p.vendor_id, s.price, s.sku, s.offer, s.in_stock, s.id, s.status, s.offer_start_date, s.offer_end_date
ORDER BY s.price ASC;

-- name: GetSkuById :one
SELECT
    p.name AS product_name,
    p.images,
    p.vendor_id,
    v.store_name,
    v.banner,
    s.*,
    (s.price*(100-s.offer)/100) AS offer_price,
    jsonb_object_agg(
            COALESCE(pv.name, ''),
            COALESCE(vo.name, '')
    ) AS variant_options
FROM skus s
         INNER JOIN products p ON p.id = s.product_id
         INNER JOIN vendors v ON v.id = p.vendor_id
         LEFT JOIN skus_variant_options so ON so.sku_id = s.id
         LEFT JOIN variant_options vo ON so.variant_option = vo.id
         LEFT JOIN product_variants pv ON vo.product_variant_id = pv.id
WHERE s.id = $1
GROUP BY p.name, p.vendor_id, p.images, v.store_name, v.banner, s.price, s.sku, s.offer, s.in_stock, s.id, offer_price,s.status;

-- name: UpdateSkuById :exec
UPDATE skus
SET sku = $1, offer = $2, in_stock = $3, price = $4, offer_start_date = $5, offer_end_date = $6, status = $7
WHERE id = $8;

-- name: DeleteSkuById :exec
DELETE FROM skus WHERE id = $1;