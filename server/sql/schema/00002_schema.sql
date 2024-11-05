-- +goose Up
-- +goose StatementBegin
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'lock');

ALTER TABLE users
    ADD COLUMN status user_status default 'inactive',
    ADD COLUMN full_name VARCHAR(255),
    ADD COLUMN phone_number VARCHAR(10),
    ADD COLUMN dob DATE,
    ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE users
DROP COLUMN status,
    DROP COLUMN full_name,
    DROP COLUMN phone_number,
    DROP COLUMN dob,
    DROP COLUMN created_at,
    DROP COLUMN updated_at;

DROP TRIGGER IF EXISTS set_updated_at ON users;
DROP FUNCTION IF EXISTS update_timestamp();
DROP TYPE IF EXISTS user_status;

DROP TYPE IF EXISTS user_status;
-- +goose StatementEnd
