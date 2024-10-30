-- name: GetFullCategories :many
SELECT
    c.id AS category_id,
    c.name AS category_name,
    c.url AS category_url,
    c.icon AS category_icon,
    c.component AS category_component,
    sc.name AS sub_category_name,
    sc.url AS sub_category_url,
    cc.name AS child_category_name,
    cc.url AS child_category_url
FROM
    categories c
        LEFT JOIN
    sub_categories sc ON c.id = sc.category_id
        LEFT JOIN
    child_categories cc ON sc.id = cc.sub_category_id;

-- name: AddCategory :exec
INSERT INTO categories (name, name_code, icon, component) Values ($1, $2, $3, $4);


-- name: AddSubcategory :exec
INSERT INTO sub_categories (category_id, name, name_code, component)
VALUES (
(SELECT categories.id FROM categories WHERE categories.name = $1),
$2,
        $3,
$4
);

-- name: AddChildCategory :exec
INSERT INTO child_categories (sub_category_id, name, name_code)
VALUES (
$1,
        $2,
        $3
);
