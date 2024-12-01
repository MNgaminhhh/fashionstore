-- name: CreateFlashSales :exec
INSERT INTO flash_sales (start_date, end_date) VALUES ($1, $2);

-- name: GetAllFlashSales :many
SELECT * FROM flash_sales
ORDER BY updated_at;

-- name: GetFlashSaleById :one
SELECT * FROM flash_sales
WHERE id = $1
ORDER BY updated_at DESC;

-- name: DeleteFlashSaleById :exec
DELETE FROM flash_sales
WHERE id = $1;

-- name: UpdateFlashSale :exec
UPDATE flash_sales
SET start_date = $1, end_date = $2
WHERE id = $3;