-- name: CreateCondition :exec
INSERT INTO conditions (field, operator, value) VALUES ($1, $2, $3);