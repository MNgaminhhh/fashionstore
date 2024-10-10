-- +goose Up
-- +goose StatementBegin
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'lock');

ALTER TABLE users
ADD COLUMN status user_status default 'inactive' not null;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE users
DROP COLUMN status;

DROP TYPE IF EXISTS user_status;
-- +goose StatementEnd
