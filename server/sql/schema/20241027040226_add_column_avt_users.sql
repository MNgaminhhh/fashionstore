-- +goose Up
-- +goose StatementBegin
ALTER TABLE users
ADD COLUMN avt VARCHAR(255),
ADD CONSTRAINT users_phone_number_key UNIQUE (phone_number);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE users
DROP COLUMN avt,
DROP CONSTRAINT users_phone_number_key;
-- +goose StatementEnd
