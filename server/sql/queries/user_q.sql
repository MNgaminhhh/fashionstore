-- name: GetAllUser :many
SELECT *
FROM users
WHERE
    (full_name ILIKE '%' || $1 || '%' OR $1 IS NULL)
  AND (dob = $2 OR $2 IS NULL)
  AND (email ILIKE '%' || $3 || '%' OR $3 IS NULL)
  AND (status = $4 OR $4 IS NULL)
  AND (phone_number ILIKE '%' || $5 || '%' OR $5 IS NULL)
ORDER BY updated_at DESC;

-- name: GetUserByEmail :one
SELECT *
From users
WHERE email = $1 LIMIT 1;

-- name: CreateNewUser :exec
INSERT INTO users (email, password)
VALUES ($1, $2);

-- name: UpdateUserStatus :exec
UPDATE users
SET status = $1
WHERE email = $2;

-- name: GetUserActived :many
SELECT *
FROM users
WHERE status = $1;


-- name: UpdateNewPassword :exec
UPDATE users
SET password = $1
WHERE email = $2;

-- name: UpdateUser :exec
UPDATE  users
SET full_name = $1, phone_number = $2, dob = $3, avt = $4, role = $5
WHERE id = $6;

-- name: GetUserById :one
SELECT * FROM users
WHERE id = $1;