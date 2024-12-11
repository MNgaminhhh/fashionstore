package pg_error

type ErrorCode string

const (
	ForeignKeyViolation ErrorCode = "23503"
	UniqueViolation     ErrorCode = "23505"
)
