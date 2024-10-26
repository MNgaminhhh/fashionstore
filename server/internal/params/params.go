package params

import "time"

type GetAllVendorsParams struct {
	Status    *string
	StoreName *string
	StartDate *time.Time
	EndDate   *time.Time
	SortBy    string
	SortOrder string
	Limit     int
	Offset    int
}
