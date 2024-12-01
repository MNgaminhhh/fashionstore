-- +goose Up
-- +goose StatementBegin
CREATE TABLE flash_sales(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL CHECK ( end_date > flash_sales.start_date ),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE flash_sales_items(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flash_sales_id UUID NOT NULL,
    product_id UUID NOT NULL,
    show BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON flash_sales
    FOR EACH ROW
    EXECUTE FUNCTION update_product_timestamp();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON flash_sales_items
    FOR EACH ROW
    EXECUTE FUNCTION update_product_timestamp();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER IF EXISTS set_flash_sales_updated_at ON flash_sales;
DROP TRIGGER IF EXISTS set_flash_sales_items_updated_at ON flash_sales_items;

DROP TABLE IF EXISTS flash_sales_items;
DROP TABLE IF EXISTS flash_sales;
-- +goose StatementEnd
