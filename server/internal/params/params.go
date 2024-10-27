package params

import (
	"time"
)

type GetAllVendorsParams struct {
	Status    *string
	StoreName *string
	StartDate *time.Time
	EndDate   *time.Time
	SortBy    string
	SortOrder string
}

type GetBrandsParams struct {
	visible bool
	name    *string
}
