-- +goose Up
-- +goose StatementBegin
ALTER TABLE brands
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON brands
    FOR EACH ROW
    EXECUTE FUNCTION update_vendor_timestamp();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE brands
DROP COLUMN IF EXISTS created_at,
DROP COLUMN IF EXISTS updated_at;

DROP TRIGGER IF EXISTS set_updated_at ON brands;
-- +goose StatementEnd
