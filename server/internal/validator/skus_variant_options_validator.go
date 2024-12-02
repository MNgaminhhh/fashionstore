package validator

type CreateSkuVariantOptionValidator struct {
	SkuId           string `json:"sku_id" validate:"required"`
	VariantOptionId string `json:"variant_id" validate:"required"`
}
