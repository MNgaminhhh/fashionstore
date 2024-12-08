-- +goose Up
-- +goose StatementBegin
CREATE TABLE coupons_users(
    coupon_id UUID NOT NULL REFERENCES coupons(id),
    user_id UUID NOT NULL REFERENCES users(id),
    order_id UUID NOT NULL REFERENCES order_bills(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (coupon_id, user_id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE coupons_users;
-- +goose StatementEnd
