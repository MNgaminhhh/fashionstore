-- +goose Up
-- +goose StatementBegin
CREATE TYPE components_type AS ENUM('MegaMenu1.name', 'MegaMenu2.name', 'null');

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE ,
    name_code VARCHAR(255) NOT NULL UNIQUE ,
    url VARCHAR(255),
    icon VARCHAR(255),
    status INTEGER DEFAULT 1 CHECK (status IN (0, 1)),
    component components_type DEFAULT 'MegaMenu1.name',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE sub_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL ,
    name VARCHAR(255) NOT NULL ,
    name_code VARCHAR(255) NOT NULL ,
    url VARCHAR(255),
    status INTEGER DEFAULT 1 CHECK (status IN (0, 1)),
    component components_type DEFAULT 'MegaMenu1.name',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE child_categories (
      id SERIAL PRIMARY KEY,
      sub_category_id UUID REFERENCES sub_categories(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      name_code VARCHAR(255) NOT NULL,
      url VARCHAR(255),
      status INTEGER DEFAULT 1 CHECK (status IN (0, 1)),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION set_default_url_for_categories()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.url IS NULL THEN
        NEW.url := '/categories/' || NEW.name_code;
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_default_url_before_insert
    BEFORE INSERT ON categories
    FOR EACH ROW
    EXECUTE FUNCTION set_default_url_for_categories();

CREATE TRIGGER set_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_vendor_timestamp();

CREATE TRIGGER set_sub_categories_updated_at
    BEFORE UPDATE ON sub_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_vendor_timestamp();

CREATE TRIGGER set_child_categories_updated_at
    BEFORE UPDATE ON child_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_vendor_timestamp();


-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS child_categories;
DROP TABLE IF EXISTS sub_categories;
DROP TABLE IF EXISTS categories;
DROP FUNCTION IF EXISTS set_default_url_for_categories();
DROP TYPE IF EXISTS components_type;
-- +goose StatementEnd