package validator

type CreateProductVariantValidator struct {
	Name   string  `json:"name" validate:"required"`
	Status *string `json:"status" validate:"oneof=active inactive discontinued out_of_stock"`
}

type UpdateProductVariantValidator struct {
	Name   *string `json:"name"`
	Status *string `json:"status" validate:"oneof=active inactive discontinued out_of_stock"`
}

type FilterProductVariantValidator struct {
	Name   *string `json:"name"`
	Status *string `json:"status" validate:"oneof=active inactive discontinued out_of_stock"`
	Page   *int    `json:"page"`
	Limit  *int    `json:"limit"`
}
