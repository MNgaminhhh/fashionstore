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

-- name: UpdateStatus :exec
UPDATE vendors
SET status = $1
WHERE user_id = $2;