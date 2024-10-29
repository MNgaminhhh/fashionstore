-- +goose Up
-- +goose StatementBegin
INSERT INTO categories (name, name_code, url, icon, status, component)
VALUES
    ('Điện Tử', 'dien-tu', '/categories/dien-tu', 'icon_dien_tu.png', 1, 'MegaMenu1.name'),
    ('Thời Trang', 'thoi-trang', '/categories/thoi-trang', 'icon_thoi_trang.png', 1, 'MegaMenu1.name'),
    ('Gia Dụng', 'gia-dung', '/categories/gia-dung', 'icon_gia_dung.png', 1, 'MegaMenu1.name'),
    ('Sức Khỏe', 'suc-khoe', '/categories/suc-khoe', 'icon_suc_khoe.png', 1, 'MegaMenu1.name'),
    ('Thể Thao', 'the-thao', '/categories/the-thao', 'icon_the_thao.png', 1, 'MegaMenu1.name');

INSERT INTO sub_categories (category_id, name, name_code, url, status, component)
VALUES
    ((SELECT id FROM categories WHERE name = 'Điện Tử'), 'Điện Thoại', 'dien-thoai', '/categories/dien-tu/dien-thoai', 1, 'MegaMenu1.name'),
    ((SELECT id FROM categories WHERE name = 'Điện Tử'), 'Laptop', 'laptop', '/categories/dien-tu/laptop', 1, 'MegaMenu1.name'),
    ((SELECT id FROM categories WHERE name = 'Thời Trang'), 'Nam', 'thoi-trang-nam', '/categories/thoi-trang/nam', 1, 'MegaMenu1.name'),
    ((SELECT id FROM categories WHERE name = 'Thời Trang'), 'Nữ', 'thoi-trang-nu', '/categories/thoi-trang/nu', 1, 'MegaMenu1.name'),
    ((SELECT id FROM categories WHERE name = 'Gia Dụng'), 'Nhà Bếp', 'nha-bep', '/categories/gia-dung/nha-bep', 1, 'MegaMenu1.name'),
    ((SELECT id FROM categories WHERE name = 'Thể Thao'), 'Bóng Đá', 'bong-da', '/categories/the-thao/bong-da', 1, 'MegaMenu1.name');

INSERT INTO child_categories (sub_category_id, name, name_code, url, status)
VALUES
    ((SELECT id FROM sub_categories WHERE name = 'Điện Thoại'), 'Smartphone', 'smartphone', '/categories/dien-tu/dien-thoai/smartphone', 1),
    ((SELECT id FROM sub_categories WHERE name = 'Điện Thoại'), 'Điện Thoại Thông Minh', 'dt-thong-minh', '/categories/dien-tu/dien-thoai/dt-thong-minh', 1),
    ((SELECT id FROM sub_categories WHERE name = 'Laptop'), 'LaptopGaming', 'laptop-gaming', '/categories/dien-tu/laptop/laptop-gaming', 1),
    ((SELECT id FROM sub_categories WHERE name = 'Nam'), 'Áo Nam', 'ao-nam', '/categories/thoi-trang/nam/ao-nam', 1),
    ((SELECT id FROM sub_categories WHERE name = 'Nữ'), 'Váy Nữ', 'vay-nu', '/categories/thoi-trang/nu/vay-nu', 1);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM child_categories WHERE name IN ('Smartphone', 'Điện Thoại Thông Minh', 'Laptop Gaming', 'Áo Nam', 'Váy Nữ');
DELETE FROM sub_categories WHERE name IN ('Điện Thoại', 'Laptop', 'Nam', 'Nữ', 'Nhà Bếp');
DELETE FROM categories WHERE name IN ('Điện Tử', 'Thời Trang', 'Gia Dụng');

-- +goose StatementEnd

