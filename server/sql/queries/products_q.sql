-- name: AddProduct :one
INSERT INTO products (
    name,
    slug,
    images,
    vendor_id,
    category_id,
    sub_category_id,
    child_category_id,
    short_description,
    long_description,
    product_type,
    status,
    is_approved
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
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
    short_description,
    long_description,
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
    short_description = $9,
    long_description = $10,
    product_type = $11,
    status = $12,
    is_approved = $13
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
    p.short_description,
    p.long_description,
    p.product_type,
    p.status,
    p.is_approved,
    p.created_at,
    p.updated_at,
    v.store_name,
    c.name AS category_name,
    sc.name AS sub_category_name,
    cc.name AS child_category_name
FROM products p
    LEFT JOIN vendors v ON p.vendor_id = v.id
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN sub_categories sc ON sc.id = p.sub_category_id
    LEFT JOIN child_categories cc ON cc.id = p.child_category_id
WHERE
    (v.store_name ILIKE '%' || COALESCE($1, '') || '%' OR $1 IS NULL) AND
    (p.name ILIKE '%' || COALESCE($2, '') || '%' OR $2 IS NULL) AND
    (p.product_type ILIKE '%' || COALESCE($3, '') || '%' OR $3 IS NULL) AND
    (p.status = COALESCE($4, p.status) OR $4 IS NULL) AND
    (p.vendor_id = COALESCE(NULLIF($5::text, '')::UUID, p.vendor_id) OR $5 IS NULL) AND
    (c.name ILIKE '%' || COALESCE($6, '') || '%' OR $6 IS NULL ) AND
    (p.is_approved = COALESCE($7, p.is_approved) OR $7 IS NULL) AND
    (sc.name ILIKE '%' || COALESCE($8, '') || '%' OR $8 IS NULL) AND
    (cc.name ILIKE '%' || COALESCE($9, '') || '%' OR $9 IS NULL)
ORDER BY p.updated_at DESC;

-- name: ViewFullDetailOfProduct :one
SELECT p.id, p.name, p.long_description, p.images, p.vendor_id, p.short_description,
       v.store_name, v.full_name AS vendor_full_name, v.phone_number, v.description AS vendor_description,
       v.address AS vendor_address, v.banner AS vendor_banner, v.email,
       c.name AS category_name,
       JSON_AGG(DISTINCT pv.name) AS variants,

       JSON_AGG(
           JSON_BUILD_OBJECT(
                pv.name, vo.name
            )
       ) AS options
FROM products p
INNER JOIN product_variants pv ON pv.product_id = p.id
INNER JOIN variant_options vo ON vo.product_variant_id = pv.id
INNER JOIN vendors v ON p.vendor_id = v.id
INNER JOIN categories c ON p.category_id = c.id
WHERE p.slug = $1
GROUP BY p.id, p.name, p.long_description, p.images, p.vendor_id, p.short_description,
v.store_name, v.full_name, v.phone_number, v.description, v.address, v.banner, v.email,
c.name;


-- name: GetFlashSaleProductNow :many
SELECT f.*,
       p.id,
       p.name,
       p.slug,
       p.images,
       p.vendor_id,
       p.category_id,
       p.sub_category_id,
       p.child_category_id,
       p.short_description,
       p.long_description,
       p.product_type,
       p.status,
       p.is_approved,
       p.created_at,
       p.updated_at,
       v.store_name,
       c.name AS category_name,
       sc.name AS sub_category_name,
       cc.name AS child_category_name
FROM flash_sales_items f
    INNER JOIN flash_sales fl ON f.flash_sales_id = fl.id
    INNER JOIN products p ON f.product_id = p.id
    INNER JOIN vendors v ON p.vendor_id = v.id
    INNER JOIN categories c ON p.category_id = c.id
    LEFT JOIN sub_categories sc ON sc.id = p.sub_category_id
    LEFT JOIN child_categories cc ON cc.id = p.child_category_id
WHERE fl.start_date <= CURRENT_TIMESTAMP AND fl.end_date >= CURRENT_TIMESTAMP
    AND (show = $1 OR $1 IS NULL);