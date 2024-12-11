-- +goose Up
-- +goose StatementBegin
CREATE TABLE delivery_info(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    receiver_name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone_number VARCHAR(10) NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON delivery_info
    FOR EACH ROW
    EXECUTE FUNCTION update_product_timestamp();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE delivery_info;
-- +goose StatementEnd
