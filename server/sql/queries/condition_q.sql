-- name: CreateCondition :exec
INSERT INTO conditions (field, operator, value, description) VALUES ($1, $2, $3, $4);

-- name: GetAllCondition :many
SELECT *
FROM conditions
WHERE (description ILIKE '%' || $1 || '%' OR $1 IS NULL);

-- name: GetConditionById :one
SELECT *
FROM conditions
WHERE id = $1;

-- name: UpdateCondition :exec
UPDATE conditions
SET field = $1, operator = $2, value = $3, description = $4
WHERE id = $5;

-- name: DeleteCondition :exec
DELETE FROM conditions
WHERE id = $1;