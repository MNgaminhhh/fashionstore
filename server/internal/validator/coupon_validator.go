package validator

import "github.com/google/uuid"

type CreateConditionValidator struct {
	Field    string `json:"field" validate:"required,oneof=price shipping_cost"`
	Operator string `json:"operator" validate:"required,oneof=> = >="`
	Value    string `json:"value" validate:"required"`
}

type CreateCouponValidator struct {
	Code       string                     `json:"code" validate:"required"`
	Quantity   int                        `json:"quantity" validate:"required"`
	StartDate  string                     `json:"start_date" validate:"required"`
	EndDate    string                     `json:"end_date" validate:"required"`
	Type       string                     `json:"type" validate:"required,oneof=shipping_fixed shipping_percentage fixed percentage"`
	Discount   int                        `json:"discount" validate:"required"`
	MaxPrice   int                        `json:"max_price" validate:"required"`
	Name       string                     `json:"name" validate:"required"`
	Conditions []ConditionCouponValidator `json:"condition" validate:"required,dive,required"`
}

type ConditionCouponValidator struct {
	ConditionId uuid.UUID `json:"condition_id" validate:"required"`
	Description string    `json:"description" validate:"required"`
}