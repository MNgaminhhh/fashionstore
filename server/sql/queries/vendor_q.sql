-- name: GetVendorByUserId :one
SELECT * FROM vendors
WHERE vendors.user_id = $1;

-- name: AddVendor :exec
INSERT INTO vendors (user_id,
                     full_name,
                     email,
                     phone_number,
                     store_name,
                     description,
                     address,
                     banner,
                     created_by,
                     updated_by)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);

-- name: UpdateVendorStatus :exec
UPDATE vendors
SET status = $1, updated_by = $2
WHERE user_id = $3;

-- name: GetAllVendors :many
SELECT *
FROM vendors
WHERE
    ($1::vendors_status = 'null' OR status = $1)
  AND (store_name ILIKE '%' || $2::text || '%' OR $2 = '')
  AND (created_at >= $3::timestamp OR $3 = '0001-01-01 00:00:00' )
  AND (created_at <= $4::timestamp OR $4 = '0001-01-01 00:00:00');
