-- +goose Up
-- +goose StatementBegin
CREATE TYPE order_status AS ENUM (
    'paying',
    'pending',
    'shipping',
    'delivered',
    'canceled'
);

CREATE TYPE paying_method AS ENUM (
    'COD',
    'QR_CODE'
);

CREATE TABLE order_bills(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL references users(id),
    delivery_info_id UUID NOT NULL references delivery_info(id),
    order_code TEXT NOT NULL UNIQUE,
    product_total BIGINT NOT NULL,
    shipping_fee BIGINT NOT NULL,
    product_discount BIGINT DEFAULT 0,
    shipping_discount BIGINT DEFAULT 0,
    total_bill BIGINT NOT NULL,
    paying_method paying_method,
    order_status order_status DEFAULT 'paying',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE skus_order_bills(
    sku_id UUID NOT NULL REFERENCES skus(id) ON DELETE SET NULL,
    quantity int NOT NULL CHECK ( quantity > 0 ),
    order_id UUID NOT NULL REFERENCES order_bills(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE SET NULL,
    is_prepared BOOLEAN default false,
    price BIGINT NOT NULL,
    offer_price BIGINT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (sku_id, order_id)
);

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON order_bills
    FOR EACH ROW
    EXECUTE FUNCTION update_product_timestamp();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON skus_order_bills
    FOR EACH ROW
    EXECUTE FUNCTION update_product_timestamp();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS skus_order_bills CASCADE;
DROP TABLE IF EXISTS order_bills CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS paying_method CASCADE;
-- +goose StatementEnd
