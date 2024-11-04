-- name: AddBanner :exec
INSERT INTO banners (title, banner_image, description, text, link, serial)
VALUES ($1,$2,$3,$4, $5, $6);

-- name: GetBannersByStatus :many
SELECT * FROM banners
WHERE status = $1
ORDER BY serial ASC;

-- name: GetAllBanners :many
SELECT * FROM banners
ORDER BY updated_at DESC;


-- name: UpdateBanner :exec
UPDATE banners
SET title = $2, banner_image = $3, description = $4, text = $5, link = $6, serial = $7, status = $8
WHERE id = $1;