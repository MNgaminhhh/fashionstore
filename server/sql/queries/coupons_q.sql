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

-- name: GetAllCoupon :many
SELECT
    c.*,
    JSON_AGG(
            JSON_BUILD_OBJECT(
                    'condition_id', con.id,
                    'condition_description', con.description
            )
    ) AS conditions
FROM coupons c
         INNER JOIN conditions_coupons cc ON c.id = cc.coupon_id
         INNER JOIN conditions con ON cc.condition_id = con.id
WHERE (name ILIKE '%' || $1 || '%' OR $1 IS NULL)
AND (type = COALESCE(NULLIF($2, '')::discount_type, type) OR $2 = '' )
AND (quantity = $3 OR $3 = -1)
AND (total_used = $4 OR $4 IS NULL)
AND (discount = $5 OR $5 = -1)
AND (max_price = $6 OR $6 = -1)
AND (status = $7 OR $7 IS NULL)
GROUP BY c.id
ORDER BY updated_at DESC;

-- name: GetAllCouponCanUse :many
SELECT
    c.*,
    JSON_AGG(
            JSON_BUILD_OBJECT(
                'condition_id', con.id,
                'condition_description', con.description,
                'operator', con.operator,
                'value', con.value
            )
    ) AS conditions
FROM coupons c
         INNER JOIN conditions_coupons cc ON c.id = cc.coupon_id
         INNER JOIN conditions con ON cc.condition_id = con.id
WHERE (c.status = true)
AND (c.start_date <= CURRENT_TIMESTAMP)
AND (c.end_date >= CURRENT_TIMESTAMP)
AND (c.total_used != c.quantity)
GROUP BY c.id
ORDER BY updated_at DESC;

-- name: GetCouponById :one
SELECT
    c.*,
    JSON_AGG(
            JSON_BUILD_OBJECT(
                'condition_id', con.id,
                'condition_description', con.description,
                'field', con.field,
                'operator', con.operator,
                'value', con.value
            )
    ) AS conditions
FROM coupons c
         INNER JOIN conditions_coupons cc ON c.id = cc.coupon_id
         INNER JOIN conditions con ON cc.condition_id = con.id
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

-- name: UpdateCouponTotalUsed :exec
UPDATE coupons
SET total_used = total_used + 1
WHERE id = $1;

-- name: DeleteCoupon :exec
DELETE FROM coupons
WHERE id = $1;

-- name: CreateConditionCoupon :exec
INSERT INTO conditions_coupons (coupon_id, condition_id) VALUES ($1, $2);

-- name: DeleteConditionCouponByCouponId :exec
DELETE FROM conditions_coupons
WHERE coupon_id = $1;