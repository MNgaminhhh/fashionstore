-- +goose Up
-- +goose StatementBegin
CREATE TABLE reviews(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku_id UUID NOT NULL REFERENCES skus(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES order_bills(id),
    rating FLOAT NOT NULL CHECK ( rating > 0 AND RATING <= 5 ),
    comment JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (sku_id, user_id, order_id)
);

CREATE TABLE comments(
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID NOT NULL REFERENCES skus(id) ON DELETE CASCADE,
     review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
     comment JSONB NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_product_timestamp();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_product_timestamp();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE comments;
DROP TABLE reviews;
-- +goose StatementEnd
