-- name: AddProduct :one
INSERT INTO products (
    name,
    slug,
    images,
    vendor_id,
    category_id,
    sub_category_id,
    child_category_id,
    qty,
    short_description,
    long_description,
    sku,
    price,
    offer_price,
    offer_start_date,
    offer_end_date,
    product_type,
    status,
    is_approved
) VALUES (
         $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
     )
RETURNING id, created_at, updated_at;

-- name: GetProductByID :one
SELECT
    id,
    name,
    slug,
    images,
    vendor_id,
    category_id,
    sub_category_id,
    child_category_id,
    qty,
    short_description,
    long_description,
    sku,
    price,
    offer_price,
    offer_start_date,
    offer_end_date,
    product_type,
    status,
    is_approved,
    created_at,
    updated_at
FROM products
WHERE id = $1;

-- name: UpdateProduct :exec
UPDATE products
SET
    name = $2,
    slug = $3,
    images = $4,
    vendor_id = $5,
    category_id = $6,
    sub_category_id = $7,
    child_category_id = $8,
    qty = $9,
    short_description = $10,
    long_description = $11,
    sku = $12,
    price = $13,
    offer_price = $14,
    offer_start_date = $15,
    offer_end_date = $16,
    product_type = $17,
    status = $18,
    is_approved = $19
WHERE id = $1;

-- name: DeleteProduct :exec
DELETE FROM products WHERE id = $1;

-- name: ListProducts :many
SELECT
    p.id,
    p.name,
    p.slug,
    p.images,
    p.vendor_id,
    p.category_id,
    p.sub_category_id,
    p.child_category_id,
    p.qty,
    p.short_description,
    p.long_description,
    p.sku,
    p.price,
    p.offer_price,
    p.offer_start_date,
    p.offer_end_date,
    p.product_type,
    p.status,
    p.is_approved,
    p.created_at,
    p.updated_at,
    v.store_name,
    c.name AS category_name
FROM products p
         LEFT JOIN vendors v ON p.vendor_id = v.id
         LEFT JOIN categories c ON p.category_id = c.id
WHERE
    (v.store_name ILIKE '%' || COALESCE($1, '') || '%' OR $1 IS NULL) AND
    (p.sku ILIKE '%' || COALESCE($2, '') || '%' OR $2 IS NULL) AND
    (p.name ILIKE '%' || COALESCE($3, '') || '%' OR $3 IS NULL) AND
    (p.product_type ILIKE '%' || COALESCE($4, '') || '%' OR $4 IS NULL) AND
    (p.status = COALESCE($5, p.status) OR $5 IS NULL) AND
    (CAST(p.price AS TEXT) ILIKE '%' || COALESCE($6, '') || '%' OR $6 IS NULL)
ORDER BY p.created_at DESC;

