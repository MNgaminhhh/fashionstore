package validator

type UpdateFlashSaleValidator struct {
	StartDate *string `json:"start_date"`
	EndDate   *string `json:"end_date"`
}

type CreateFlashSaleValidator struct {
	StartDate string `json:"start_date" validate:"required"`
	EndDate   string `json:"end_date" validate:"required"`
}

type FilterFlashSaleValidator struct {
	StartDate *string `json:"start_date"`
	EndDate   *string `json:"end_date"`
}
