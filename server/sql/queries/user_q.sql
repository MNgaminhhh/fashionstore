-- name: GetAllUser :many
SELECT
    *
  FROM users;

-- name: GetUserByEmail :one
SELECT * From users WHERE email = $1 LIMIT 1;