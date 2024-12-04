-- name: CreateFlashSales :exec
INSERT INTO flash_sales (start_date, end_date) VALUES ($1, $2);

-- name: GetAllFlashSales :many
SELECT *
FROM flash_sales
WHERE (DATE(start_date) = $1::DATE OR $1 = '0001-01-01')
  AND (DATE(end_date) = $2::DATE OR $2 = '0001-01-01')
ORDER BY updated_at DESC;

-- name: GetFlashSaleById :one
SELECT * FROM flash_sales
WHERE id = $1;

-- name: DeleteFlashSaleById :exec
DELETE FROM flash_sales
WHERE id = $1;

-- name: UpdateFlashSale :exec
UPDATE flash_sales
SET start_date = $1, end_date = $2
WHERE id = $3;

-- name: CreateFlashSaleItem :exec
INSERT INTO flash_sales_items (flash_sales_id, product_id, show) VALUES ($1, $2, $3);

-- name: GetAllFlashSaleItemByFlashSaleId :many
SELECT f.*, p.name
FROM flash_sales_items f
    LEFT JOIN products p ON f.product_id = p.id
WHERE f.flash_sales_id = $1
    AND (p.name ILIKE '%' ||$2 || '%' OR $2 IS NULL)
    AND (show = $3 OR $3 IS NULL)
ORDER BY f.updated_at DESC;

-- name: GetFlashSaleItemById :one
SELECT f.*, p.name
FROM flash_sales_items f
    LEFT JOIN products p ON f.product_id = p.id
WHERE f.id = $1;

-- name: UpdateFlashSaleItemById :exec
UPDATE flash_sales_items
SET product_id = $1, show = $2
WHERE id = $3;

-- name: DeleteFlashSaleItemById :exec
DELETE FROM flash_sales_items
WHERE id = $1;