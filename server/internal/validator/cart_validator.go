package validator

type CreateCartItemValidator struct {
	SkuId    string `json:"sku_id" validate:"required"`
	Quantity int    `json:"quantity" validate:"required,min=0"`
}
