package params

import (
	"backend/internal/database"
	"time"
)

type GetAllVendorsParams struct {
	Status    database.VendorsStatus
	StoreName *string
	StartDate *time.Time
	EndDate   *time.Time
	SortBy    string
	SortOrder string
}

type Pagination struct {
	Limit  int
	Offset int
}
