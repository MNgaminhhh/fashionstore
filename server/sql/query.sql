
-- name: GetUserByEmail :one
SELECT * From users WHERE email = $1 LIMIT 1;