-- +goose Up
-- +goose StatementBegin
INSERT INTO users (email, password)
VALUES ('mtt@gmail.com', 'admin');
INSERT INTO users (email, password)
VALUES ('mtt12@gmail.com', 'admin');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE
FROM users
WHERE email IN ('mtt@gmail.com', 'mtt12@gmail.com');
-- +goose StatementEnd
