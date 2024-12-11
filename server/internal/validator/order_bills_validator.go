package validator

type SkuValidator struct {
	SkuId    string `json:"sku_id" validate:"required"`
	Quantity int    `json:"quantity" validate:"required"`
}

type CreateBillValidator struct {
	Skus           []SkuValidator `json:"skus" validate:"required,dive,required"`
	ShippingCoupon *string        `json:"shipping_coupon"`
	ProductCoupon  *string        `json:"product_coupon"`
	DeliveryInfo   string         `json:"delivery_info" validate:"required"`
	PayingMethod   string         `json:"paying_method" validate:"required,oneof=COD QR_CODE"`
}

type FilterUpdateBillValidator struct {
	OrderStatus  *string `json:"order_status" validate:"oneof=paying pending shipping delivered cancelled refund"`
	IsPrepared   *bool   `json:"is_prepared"`
	OrderCode    *string `json:"order_code"`
	PayingMethod *string `json:"paying_method" validate:"oneof=COD QR_CODE"`
	Page         *int    `json:"page"`
	Limit        *int    `json:"limit"`
}

type UpdateSkusOrderValidator struct {
	IsPrepared *bool `json:"is_prepared" validate:"required"`
}
