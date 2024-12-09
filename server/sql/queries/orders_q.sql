-- name: CreateOrderBill :exec
INSERT INTO order_bills (
    id,
    order_code,
    product_total,
    shipping_fee,
    product_discount,
    shipping_discount,
    total_bill,
    user_id,
    delivery_info_id
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);

-- name: UpdateStatusOrderBill :exec
UPDATE order_bills
SET order_status = $1
WHERE id = $2;

-- name: DeleteOrderBill :exec
DELETE FROM order_bills
WHERE id = $1;

-- name: CreateOrderBillSku :exec
INSERT INTO skus_order_bills (sku_id, order_id, vendor_id, quantity, price, offer_price)
VALUES ($1, $2, $3,$4, $5, $6);

-- name: GetAllOrderBillsOfVendor :many
SELECT *
FROM skus_order_bills
WHERE vendor_id = $1
  AND (is_prepared = $2 OR $2 IS NULL)
ORDER BY updated_at;

-- name: GetAllSkusByOrderId :many
SELECT *
FROM skus_order_bills
WHERE order_id = $1 AND
      (is_prepared = $2 OR $2 IS NULl)
ORDER BY updated_at;

-- name: UpdateOrderBillsOfVendor :exec
UPDATE skus_order_bills
SET is_prepared = $1
WHERE vendor_id = $2 AND order_id = $3;
