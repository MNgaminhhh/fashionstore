-- name: CreateCartItem :exec
INSERT INTO cart (user_id, sku_id, quantity) VALUES ($1, $2, $3);

-- name: GetAllSkuItemInCartByUserId :many
SELECT c.*, s.price, (s.price*(100-s.offer)/100) AS offer_price, p.id AS product_id,
       p.images, p.name, p.slug,
       v.store_name, v.banner
FROM cart c
INNER JOIN skus s ON c.sku_id = s.id
INNER JOIN products p ON s.product_id = p.id
INNER JOIN vendors v ON p.vendor_id = v.id
WHERE c.user_id = $1
ORDER BY c.updated_at DESC;

-- name: GetSkuItemInCartById :one
SELECT *
FROM cart
WHERE id = $1;

-- name: GetSkuItemInCartBySkuId :one
SELECT *
FROM cart
WHERE sku_id = $1 AND user_id = $2;

-- name: UpdateSkuItemInCart :exec
UPDATE cart
SET quantity = $1
WHERE id = $2;

-- name: DeleteSkuItemInCartById :exec
DELETE FROM cart
WHERE id = $1;
