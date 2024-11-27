-- +goose Up
-- +goose StatementBegin

CREATE TYPE variants_status AS ENUM (
    'active',
    'inactive',
    'out_of_stock',
    'discontinued'
);

CREATE TABLE skus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL,
    in_stock SMALLINT DEFAULT 0 CHECK (in_stock >= 0),
    sku VARCHAR(50) UNIQUE,
    price BIGINT NOT NULL CHECK (price >= 0),
    offer INT DEFAULT 0 CHECK (offer >= 0 AND offer <= 100),
    offer_start_date TIMESTAMP,
    offer_end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE product_variants(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    status variants_status DEFAULT 'inactive',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE variant_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_variant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    status variants_status DEFAULT 'inactive',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
);

CREATE TABLE skus_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_variant_id UUID,
    variant_option_id UUID,
    sku_id UUID NOT NULL ,
    FOREIGN KEY (sku_id) REFERENCES skus(id) ON DELETE CASCADE,
    FOREIGN KEY (product_variant_id) REFERENCES product_variants(id) ON DELETE SET NULL,
    FOREIGN KEY (variant_option_id) REFERENCES variant_options(id) ON DELETE SET NULL
);

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON skus
    FOR EACH ROW
    EXECUTE FUNCTION update_product_timestamp();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON product_variants
    FOR EACH ROW
    EXECUTE FUNCTION update_product_timestamp();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON variant_options
    FOR EACH ROW
    EXECUTE FUNCTION update_product_timestamp();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
-- Drop tables in reverse order of creation
DROP TRIGGER IF EXISTS set_updated_at ON skus;
DROP TRIGGER IF EXISTS set_updated_at ON product_variants;
DROP TRIGGER IF EXISTS set_updated_at ON variant_options;

DROP TABLE IF EXISTS skus_variants;
DROP TABLE IF EXISTS variant_options;
DROP TABLE IF EXISTS product_variants;
DROP TABLE IF EXISTS skus;

DROP TYPE IF EXISTS variants_status;
-- +goose StatementEnd
