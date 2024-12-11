-- name: CreateCouponUser :exec
INSERT INTO coupons_users (coupon_id, user_id, order_id) VALUES ($1, $2, $3);

-- name: GetCouponUserByCouponIdAndUserId :one
SELECT *
FROM coupons_users
WHERE coupon_id = $1 AND user_id = $2;