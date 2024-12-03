package validator

import "github.com/google/uuid"

type CreateSkuValidator struct {
	ProductId      string      `json:"product_id" validate:"required"`
	InStock        int         `json:"in_stock" validate:"min=0"`
	Price          float32     `json:"price" validate:"required"`
	Status         string      `json:"status" validate:"required,oneof=active inactive out_of_stock discontinued"`
	Offer          int         `json:"offer" validate:"min=0,max=100"`
	VariantOptions []uuid.UUID `json:"variant_options" validate:"required,min=1"`
}

type FilterSkuValidator struct {
	ProductName *string `json:"product_name"`
	ProductId   *string `json:"product_id"`
	Sku         *string `json:"sku"`
	Price       *int    `json:"price"`
	Offer       *int    `json:"offer"`
	OfferPrice  *int    `json:"offer_price"`
	Page        *int    `json:"page"`
	Limit       *int    `json:"limit"`
}

type UpdateSkuValidator struct {
	InStock *int    `json:"in_stock" validate:"min=0"`
	Price   *int    `json:"price" validate:"min=0"`
	SKU     *string `json:"sku"`
	Offer   *int    `json:"offer" validate:"min=0 max=100"`
}
