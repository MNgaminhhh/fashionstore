-- +goose Up
-- +goose StatementBegin
CREATE TABLE banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    banner_image VARCHAR(255) NOT NULL ,
    title VARCHAR(255) NOT NULL ,
    description TEXT,
    text VARCHAR(100) NOT NULL ,
    link VARCHAR(255),
    serial INT,
    status INTEGER DEFAULT 0 CHECK (status IN (0, 1)) NOT NULL ,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_banners_updated_at
    BEFORE UPDATE ON banners
    FOR EACH ROW
    EXECUTE FUNCTION update_vendor_timestamp();

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS banners;
-- +goose StatementEnd
