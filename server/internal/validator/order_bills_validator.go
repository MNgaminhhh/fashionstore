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
}

type FilterBillValidator struct {
	IsPrepared *bool `json:"is_prepared"`
	Page       *int  `json:"page"`
	Limit      *int  `json:"limit"`
}
