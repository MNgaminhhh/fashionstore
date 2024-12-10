-- name: CreateOrderBillSku :exec
INSERT INTO skus_order_bills (sku_id, order_id, vendor_id, quantity, price, offer_price)
VALUES ($1, $2, $3,$4, $5, $6);

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
    delivery_info_id,
    paying_method
) VALUES ($1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10);

-- name: GetAllOrderBillsOfVendor :many
SELECT sob.*
FROM skus_order_bills sob
         INNER JOIN order_bills o ON o.id = sob.order_id
WHERE sob.vendor_id = $1
  AND (sob.is_prepared = $2 OR $2 IS NULL)
  AND (o.order_status = 'pending')
ORDER BY sob.updated_at DESC;

-- name: GetAllSkusByOrderId :many
SELECT *
FROM skus_order_bills
WHERE order_id = $1 AND
    (is_prepared = $2 OR $2 IS NULl)
ORDER BY updated_at;

-- name: GetAllOrderBills :many
SELECT o.*
FROM order_bills o
WHERE (order_status = $1 OR $1 IS NULL) AND
    (order_code = $2 OR $2 = '') AND
    (paying_method = $3 OR $3 IS NULL);

-- name: GetOrderBillById :one
SELECT o.*,
       di.receiver_name,
       di.phone_number,
       di.address,
       di.email
FROM order_bills o
INNER JOIN delivery_info di ON o.delivery_info_id = di.id
WHERE o.id = $1;

-- name: UpdateStatusOrderBill :exec
UPDATE order_bills
SET order_status = $1
WHERE id = $2;

-- name: UpdateStatusOrderBillByOrderCode :exec
UPDATE order_bills
SET order_status = $1
WHERE order_code = $2;

-- name: UpdateOrderBillsOfVendor :exec
UPDATE skus_order_bills
SET is_prepared = $1
WHERE vendor_id = $2 AND order_id = $3;

-- name: DeleteOrderBill :exec
DELETE FROM order_bills
WHERE id = $1;

-- name: DeleteOrderBillByOrderCode :exec
DELETE FROM order_bills
WHERE order_code = $1;

-- name: GetAllOrderBillsOfUser :many
SELECT o.id,
       o.order_status,
       v.store_name,
       v.banner,
       o.updated_at,
       o.total_bill,
       JSON_AGG(
               JSON_BUILD_OBJECT(
                       'product_name', p.name,
                       'images', p.images,
                       'variant_option', s.variant_option,
                       'quantity', sob.quantity,
                       'price', sob.price,
                       'offer_price', sob.offer_price
               )
       ) AS skus
FROM order_bills o
         INNER JOIN skus_order_bills sob ON o.id = sob.order_id
         INNER JOIN (SELECT s.id,
                            s.product_id,
                            JSON_AGG(
                                    JSON_BUILD_OBJECT(
                                            'product_variant', pv.name,
                                            'variant_options', vo.name
                                    )
                            ) AS variant_option
                     FROM skus s
                              INNER JOIN skus_variant_options svo ON s.id = svo.sku_id
                              INNER JOIN variant_options vo ON svo.variant_option = vo.id
                              INNER JOIN product_variants pv ON pv.id = vo.product_variant_id
                     GROUP BY s.id) s ON sob.sku_id = s.id
         INNER JOIN products p ON p.id = s.product_id
         INNER JOIN vendors v ON v.id = sob.vendor_id
WHERE o.user_id = $1
GROUP BY o.id,
         o.updated_at,
         o.order_status,
         v.store_name,
         v.banner;
