-- +goose Up
-- +goose StatementBegin
CREATE TYPE condition_field AS ENUM ('price', 'shipping_cost', 'product_type');
CREATE TYPE comparison_operator AS ENUM ('>', '>=', '=');
CREATE TYPE discount_type AS ENUM('shipping', 'fixed', 'percentage');

CREATE TABLE conditions(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    field condition_field NOT NULL,
    operator comparison_operator NOT NULL,
    value JSONB NOT NULL
);

CREATE TABLE coupons(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    quantity INT NOT NULL check ( quantity > 0 ),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL check ( end_date > coupons.start_date ),
    type discount_type NOT NULL,
    discount INT NOT NULL,
    total_used INT CHECK ( total_used <= coupons.quantity ),
    max_use INT NOT NULL CHECK ( max_use > 0 ),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE conditions_coupons(
    coupon_id UUID REFERENCES coupons(id),
    condition_id UUID REFERENCES conditions(id),
    condition_describe TEXT NOT NULL,
    PRIMARY KEY (coupon_id, condition_id)
);

ALTER TABLE coupons ADD CONSTRAINT unique_coupon_code UNIQUE(code);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS conditions_coupons;
DROP TABLE IF EXISTS coupons;
DROP TABLE IF EXISTS conditions;
DROP TYPE IF EXISTS comparison_operator;
DROP TYPE IF EXISTS discount_type;
DROP TYPE IF EXISTS condition_field;
-- +goose StatementEnd
