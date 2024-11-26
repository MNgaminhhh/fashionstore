-- +goose Up
-- +goose StatementBegin
CREATE TYPE product_status AS ENUM ('inactive', 'active');

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    images JSONB NOT NULL DEFAULT '[]',
    vendor_id UUID NOT NULL,
    category_id UUID NOT NULL,
    sub_category_id UUID,
    child_category_id UUID,
    short_description TEXT DEFAULT NULL,
    long_description TEXT DEFAULT NULL,
    product_type VARCHAR(100),
    status product_status DEFAULT 'active',
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (sub_category_id) REFERENCES sub_categories(id) ON DELETE SET NULL,
    FOREIGN KEY (child_category_id) REFERENCES child_categories(id) ON DELETE SET NULL
);

CREATE OR REPLACE FUNCTION update_product_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_product_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_product_timestamp();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER IF EXISTS set_product_updated_at ON products;
DROP FUNCTION IF EXISTS update_product_timestamp();
DROP TABLE IF EXISTS products;
DROP TYPE IF EXISTS product_status;
-- +goose StatementEnd
