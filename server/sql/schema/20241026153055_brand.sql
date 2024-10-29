-- +goose Up
-- +goose StatementBegin

CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sequence int,
    store_id UUID NOT NULL ,
    name VARCHAR(255) NOT NULL ,
    image VARCHAR(255) NOT NULL ,
    visible BOOLEAN default FALSE,
    FOREIGN KEY (store_id) REFERENCES vendors(id)
)
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS brands
-- +goose StatementEnd
