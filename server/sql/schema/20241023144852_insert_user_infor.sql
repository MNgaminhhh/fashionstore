-- +goose Up
-- +goose StatementBegin
INSERT INTO users (email, password, full_name, status, phone_number, dob)
VALUES
    ('admin@example.com', '$2a$12$wI84/sdIkgRjyQml.kIYxOaUP3O5IdZh5MSuO2ht.BxxEYnLFd6CO', 'admin','active', '0123456789', '1980-01-01'),
    ('john.doe@example.com', '$2a$12$abc123examplepasswordhash', 'john','active', '0123456789', '1990-05-15'),
    ('jane.smith@example.com', '$2a$12$xyz456examplepasswordhash', 'jane','inactive', '0987654321', '1985-03-22'),
    ('alice.williams@example.com', '$2a$12$def789examplepasswordhash', 'alice','active', '0123456777', '1992-07-09'),
    ('bob.jones@example.com', '$2a$12$ghi123examplepasswordhash', 'bob','inactive', '0123498765', '1988-11-30');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM users
WHERE email IN (
    'admin@example.com',
    'john.doe@example.com',
    'jane.smith@example.com',
    'alice.williams@example.com',
    'bob.jones@example.com'
);
-- +goose StatementEnd
