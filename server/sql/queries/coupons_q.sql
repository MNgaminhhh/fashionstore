-- name: CreateCoupon :exec
INSERT INTO coupons (
    id,
    name,
    code,
    quantity,
    start_date,
    end_date,
    type,
    discount,
    max_price,
    status
) VALUES ($1, $2, $3, $4, $5, $6,$7, $8, $9, $10);

-- name: GetCouponById :one
SELECT
    c.*,
    JSON_AGG(
            JSON_BUILD_OBJECT(
                    'condition_id', con.id,
                    'condition_description', con.description
            )
    ) AS conditions
FROM coupons c
         LEFT JOIN conditions_coupons cc ON c.id = cc.coupon_id
         LEFT JOIN conditions con ON cc.condition_id = con.id
WHERE c.id = $1
GROUP BY c.id;


-- name: UpdateCouponByCouponId :exec
UPDATE coupons
SET name = $1, code = $2, quantity = $3, start_date = $4, end_date = $5, type = $6, discount = $7, max_price = $8, status = $9
WHERE id = $10;

-- name: UpdateCouponStatus :exec
UPDATE coupons
SET status = $1
WHERE id = $2;

-- name: DeleteCoupon :exec
DELETE FROM coupons
WHERE id = $1;

-- name: CreateConditionCoupon :exec
INSERT INTO conditions_coupons (coupon_id, condition_id) VALUES ($1, $2);

-- name: DeleteConditionCouponByCouponId :exec
DELETE FROM conditions_coupons
WHERE coupon_id = $1;