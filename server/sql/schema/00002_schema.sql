-- +goose Up
-- +goose StatementBegin
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'lock');

ALTER TABLE users
    ADD COLUMN status user_status default 'inactive' not null;
    ADD COLUMN full_name VARCHAR(255),
    ADD COLUMN phone_number VARCHAR(10),
    ADD COLUMN dob DATE;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE users
DROP COLUMN status,
DROP COLUMN full_name,
DROP COLUMN phone_number,
DROP COLUMN dob;

DROP TYPE IF EXISTS user_status;
-- +goose StatementEnd
