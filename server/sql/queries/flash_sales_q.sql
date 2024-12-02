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