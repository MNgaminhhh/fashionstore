-- +goose Up
-- +goose StatementBegin

CREATE OR REPLACE FUNCTION generate_sub_category_url()
RETURNS TRIGGER AS $$
BEGIN
SELECT url INTO NEW.url
FROM categories
WHERE id = NEW.category_id;

IF NEW.url IS NOT NULL THEN
        NEW.url := NEW.url || '/' || NEW.name_code;
END IF;

RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_default_url_before_insert
    BEFORE INSERT ON sub_categories
    FOR EACH ROW
    EXECUTE FUNCTION generate_sub_category_url();

CREATE TRIGGER set_default_url_before_update
    BEFORE UPDATE ON sub_categories
    FOR EACH ROW
    EXECUTE FUNCTION generate_sub_category_url();

CREATE OR REPLACE FUNCTION generate_child_category_url()
RETURNS TRIGGER AS $$
BEGIN
SELECT url INTO NEW.url
FROM sub_categories
WHERE id = NEW.sub_category_id;

IF NEW.url IS NOT NULL THEN
        NEW.url := NEW.url || '/' || NEW.name_code;
END IF;

RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE sub_categories
    ADD CONSTRAINT unique_sub_name_per_category
        UNIQUE (category_id, name);

ALTER TABLE sub_categories
    ADD CONSTRAINT unique_sub_name_code_per_category
        UNIQUE (category_id, name_code);

ALTER TABLE child_categories
    ADD CONSTRAINT unique_child_name_per_sub_cate
        UNIQUE (sub_category_id, name);

ALTER TABLE child_categories
    ADD CONSTRAINT unique_child_name_code_per_sub_cate
        UNIQUE (sub_category_id, name_code);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP FUNCTION IF EXISTS generate_child_category_url();

DROP FUNCTION IF EXISTS set_updated_at();

ALTER TABLE sub_categories
DROP CONSTRAINT IF EXISTS unique_sub_name_per_category;

ALTER TABLE sub_categories
DROP CONSTRAINT IF EXISTS unique_sub_name_code_per_category;

ALTER TABLE child_categories
DROP CONSTRAINT IF EXISTS unique_child_name_per_sub_cate;

ALTER TABLE child_categories
DROP CONSTRAINT IF EXISTS unique_child_name_code_per_sub_cate;


-- +goose StatementEnd
