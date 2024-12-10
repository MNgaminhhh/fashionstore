-- +goose Up
-- +goose StatementBegin
CREATE TABLE refund_requests(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skus_order_bills_id UUID NOT NULL REFERENCES order_bills(id)
)
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
