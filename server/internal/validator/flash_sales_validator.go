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

type CreateFlashSaleItemValidator struct {
	FlashSaleId string `json:"flash_sale_id" validate:"required"`
	ProductId   string `json:"product_id" validate:"required"`
	Show        *bool  `json:"show"`
}

type UpdateFlashSaleItemValidator struct {
	FlashSaleId *string `json:"flash_sale_id"`
	ProductId   *string `json:"product_id"`
	Show        *bool   `json:"show"`
}

type FilterFlashSaleItemValidator struct {
	ProductId   *string `json:"product_id"`
	ProductName *string `json:"product_name"`
	Show        *bool   `json:"show"`
	Page        *int    `json:"page"`
	Limit       *int    `json:"limit"`
}
