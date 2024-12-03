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
    max_price
) VALUES ($1, $2, $3, $4, $5, $6,$7, $8, $9);

-- name: DeleteCoupon :exec
DELETE FROM coupons
WHERE id = $1;

-- name: CreateConditionCoupon :exec
INSERT INTO conditions_coupons (coupon_id, condition_id,  condition_describe) VALUES ($1, $2, $3);