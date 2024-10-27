-- +goose Up
-- +goose StatementBegin
CREATE TYPE vendors_status AS ENUM ('pending', 'accepted', 'rejected', 'null');

CREATE TABLE vendors (
                         id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                         user_id UUID NOT NULL UNIQUE ,
                         full_name VARCHAR(255) NOT NULL,
                         email VARCHAR(255) NOT NULL UNIQUE ,
                         phone_number VARCHAR(10) NOT NULL UNIQUE ,
                         store_name VARCHAR(255) NOT NULL,
                         status vendors_status DEFAULT 'pending',
                         description TEXT,
                         address VARCHAR(255) NOT NULL ,
                         banner VARCHAR(255) NOT NULL ,
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         created_by UUID,
                         updated_by UUID,
                         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION update_vendor_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_vendor_updated_at
    BEFORE UPDATE ON vendors
    FOR EACH ROW
    EXECUTE FUNCTION update_vendor_timestamp();

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER IF EXISTS set_vendor_updated_at ON vendors;
DROP FUNCTION IF EXISTS update_vendor_timestamp();
DROP TABLE IF EXISTS vendors;
DROP TYPE IF EXISTS vendors_status;
-- +goose StatementEnd
