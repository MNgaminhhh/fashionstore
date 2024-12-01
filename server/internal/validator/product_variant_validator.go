package validator

type CreateProductVariantValidator struct {
	Name      string  `json:"name" validate:"required"`
	Status    *string `json:"status" validate:"oneof=active inactive discontinued out_of_stock"`
	ProductId string  `json:"product_id" validate:"required"`
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

type CreateVariantOptionValidator struct {
	Name           string `json:"name" validate:"required"`
	Status         string `json:"status" validate:"oneof=active inactive discontinued out_of_stock"`
	ProductVariant string `json:"product_variant" validate:"required"`
}

type UpdateVariantOptionValidator struct {
	Name           *string `json:"name"`
	Status         *string `json:"status" validate:"oneof=active inactive discontinued out_of_stock"`
	ProductVariant *string `json:"product_variant"`
}

type FilterVariantOptionValidator struct {
	Name               *string `json:"name"`
	Status             *string `json:"status" validate:"oneof=active inactive discontinued out_of_stock"`
	ProductVariantName *string `json:"pv_name"`
	Limit              *int    `json:"limit"`
	Page               *int    `json:"page"`
}