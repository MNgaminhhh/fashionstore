-- name: AddBanner :exec
INSERT INTO banners (title, banner_image, description, text, link, serial)
VALUES ($1,$2,$3,$4, $5, $6);

-- name: GetBannersByStatus :many
SELECT * FROM banners
WHERE status = $1
ORDER BY serial ASC;

-- name: GetAllBanners :many
SELECT * FROM banners
WHERE
    (title ILIKE '%' || $1 || '%' OR $1 IS NULL)
AND (description ILIKE '%' || $2 || '%' OR $2 IS NULL)
AND (text ILIKE '%' || $3 || '%' OR $3 IS NULL)
AND (link ILIKE '%' || $4 || '%' OR $4 IS NULL)
AND (serial = $5 OR $5 IS NULL)
AND (status = $6 OR $6 = -1)
ORDER BY updated_at DESC;


-- name: UpdateBanner :exec
UPDATE banners
SET title = $2, banner_image = $3, description = $4, text = $5, link = $6, serial = $7, status = $8
WHERE id = $1;

-- name: GetBannerById :one
SELECT * FROM banners
WHERE id = $1;

-- name: DeleteBannerById :exec
DELETE FROM banners
WHERE id = $1;