-- +goose Up
-- +goose StatementBegin
CREATE TABLE shipping_rules(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    min_order_cost BIGINT NOT NULL UNIQUE CHECK ( min_order_cost >= 0 ),
    price INT NOT NULL CHECK ( price >= 0 ),
    status BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON shipping_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_product_timestamp();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE shipping_rules;
-- +goose StatementEnd
