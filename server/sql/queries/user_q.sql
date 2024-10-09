-- name: GetAllUser :many
SELECT
    *
  FROM users;

-- name: GetUserByEmail :one
SELECT * From users WHERE email = $1 LIMIT 1;

-- name: CreateNewUser :exec
INSERT INTO users (email, password) VALUES ($1, $2);

-- name: UpdateUserStatus :exec
UPDATE users
SET status = $1
WHERE email = $2;

-- name: GetUserActived :many
SELECT * FROM users WHERE status = $1;