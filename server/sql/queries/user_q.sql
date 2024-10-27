-- name: GetAllUser :many
SELECT *
FROM users;

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
SET full_name = $1, phone_number = $2, dob = $3, avt = $4
WHERE id = $5;

-- name: GetUserById :one
SELECT * FROM users
WHERE id = $1;