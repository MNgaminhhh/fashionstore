-- +goose Up
-- +goose StatementBegin
CREATE TYPE user_role AS ENUM ('admin', 'customer', 'vendors');

ALTER TABLE users
ADD COLUMN role user_role default 'customer' not null;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE users
DROP COLUMN role;

DROP TYPE user_role;
-- +goose StatementEnd
