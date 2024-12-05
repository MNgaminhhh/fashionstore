-- name: CreateDeliveryInfo :exec
INSERT INTO delivery_info (user_id, receiver_name, address, phone_number, email)
VALUES ($1, $2, $3, $4, $5);

-- name: GetAllDeliveryInfoByUserId :many
SELECT *
FROM delivery_info
WHERE user_id = $1;

-- name: GetDeliveryInfoById :one
SELECT *
FROM delivery_info
WHERE id = $1;

-- name: UpdateDeliveryInfoById :exec
UPDATE delivery_info
SET receiver_name = $1, address = $2, phone_number = $3, email = $4
WHERE id = $5;

-- name: DeleteDeliveryInfo :exec
DELETE FROM delivery_info
WHERE id = $1;