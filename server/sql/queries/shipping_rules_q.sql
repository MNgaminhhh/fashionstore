-- name: CreateShippingRule :exec
INSERT INTO shipping_rules (name, min_order_cost, price, status)
VALUES ($1, $2,$3, $4);

-- name: GetAllShippingRules :many
SELECT *
FROM shipping_rules
WHERE (name ILIKE '%' || $1 || '%' OR $1 IS NULL)
AND (status = COALESCE($2, status) OR $2 IS NULL)
AND (min_order_cost = $3 OR $3 = -1)
AND (price = $4 OR $4 = -1)
ORDER BY price ASC;

-- name: GetShippingRuleById :one
SELECT *
FROM shipping_rules
WHERE id = $1;

-- name: UpdateShippingRuleById :exec
UPDATE shipping_rules
SET name = $1, min_order_cost = $2, price = $3, status = $4
WHERE id = $5;

-- name: DeleteShippingRuleById :exec
DELETE FROM shipping_rules
WHERE id = $1;