-- name: GetVendorByUUID :one
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
                       created_by)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8);