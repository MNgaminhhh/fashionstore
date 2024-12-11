-- +goose Up
-- +goose StatementBegin
ALTER TABLE comments DROP CONSTRAINT comments_user_id_fkey;
ALTER TABLE comments
    ADD CONSTRAINT comments_user_id_fkey
        FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE;

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE comments DROP CONSTRAINT comments_user_id_fkey;
ALTER TABLE comments
    ADD CONSTRAINT comments_user_id_fkey
        FOREIGN KEY (user_id)
            REFERENCES users(id);
-- +goose StatementEnd
