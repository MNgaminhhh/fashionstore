-- name: GetVendorById :one
SELECT
    vendors.id AS vendor_id,
    vendors.full_name AS vendor_full_name,
    vendors.email AS vendor_email,
    vendors.phone_number,
    vendors.store_name,
    vendors.status,
    vendors.description,
    vendors.address,
    vendors.banner,
    vendors.created_at,
    vendors.updated_at,
    vendors.created_by,
    vendors.updated_by,
    vendors.user_id,
    users.full_name AS user_full_name,
    users.avt AS user_avatar,
    users.email AS user_email
FROM
    vendors
        JOIN
    users ON vendors.user_id = users.id
WHERE
    vendors.id = $1;

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
  AND (full_name ILIKE '%' || $3::text || '%' OR $3 = '')
  AND (address ILIKE '%' || $4::text || '%' OR $4 = '')
  AND (description ILIKE '%' || $5::text || '%' OR $5 = '')
ORDER BY created_at DESC;
