package validator

type CommentObj struct {
	ContentType string `json:"content_type" validate:"required,oneof=image text"`
	Content     string `json:"content" validate:"required"`
}

type CreateReviewValidator struct {
	SkuId   string       `json:"sku_id" validate:"required"`
	OrderId string       `json:"order_id" validate:"required"`
	Rating  float64      `json:"rating" validate:"required"`
	Comment []CommentObj `json:"comment" validate:"required,min=1,dive,required"`
}

type UpdateReviewValidator struct {
	SkuId   *string      `json:"sku_id"`
	Rating  *float64     `json:"rating"`
	Comment []CommentObj `json:"comment" validate:"min=1,dive,required"`
}
