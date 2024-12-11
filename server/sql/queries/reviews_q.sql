-- name: CreateReview :exec
INSERT INTO reviews (user_id, sku_id, order_id, rating, comment) VALUES ($1, $2, $3, $4, $5);

-- name: GetAllReviewsByProductId :many
SELECT r.*, u.full_name, u.avt
FROM reviews r
INNER JOIN skus s ON r.sku_id = s.id
INNER JOIN users u ON r.user_id = u.id
WHERE s.product_id = $1
ORDER BY r.created_at DESC;

-- name: GetReviewById :one
SELECT *
FROM reviews
WHERE id = $1;

-- name: UpdateReviewById :exec
UPDATE reviews
SET rating = $1, comment = $2
WHERE id = $3;

-- name: DeleteReviewById :exec
DELETE FROM reviews
WHERE id = $1 AND user_id = $2;

-- name: CreateComments :exec
INSERT INTO comments (user_id, review_id, comment) VALUES ($1, $2, $3);

-- name: GetAllCommentsByReviewId :many
SELECT c.*, u.full_name, u.avt
FROM comments c
INNER JOIN users u ON u.id = c.user_id
WHERE c.review_id = $1;

-- name: GetCommentById :one
SELECT *
FROM comments
WHERE id = $1;

-- name: UpdateComment :exec
UPDATE comments
SET comment = $1
WHERE id = $2;

-- name: DeleteComment :exec
DELETE FROM comments
WHERE id = $1;