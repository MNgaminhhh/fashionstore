package validator

import "github.com/google/uuid"

type CreateConditionValidator struct {
	Field       string `json:"field" validate:"required,oneof=price shipping_cost"`
	Operator    string `json:"operator" validate:"required,oneof=> = >="`
	Value       string `json:"value" validate:"required"`
	Description string `json:"description" validate:"required,min=10"`
}

type UpdateConditionValidator struct {
	Field       *string `json:"field" validate:"oneof=price shipping_cost"`
	Operator    *string `json:"operator" validate:"oneof=> = >="`
	Value       *string `json:"value"`
	Description *string `json:"description" validate:"min=10"`
}

type FilterConditionValidator struct {
	Description *string `json:"description"`
	Page        *int    `json:"page"`
	Limit       *int    `json:"limit"`
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
	Status     *bool                      `json:"status"`
	Conditions []ConditionCouponValidator `json:"condition" validate:"required,dive,required"`
}

type FilterCouponsValidator struct {
	Quantity  *int    `json:"quantity"`
	Type      *string `json:"type" validate:"oneof=shipping_fixed shipping_percentage fixed percentage"`
	Discount  *int    `json:"discount"`
	MaxPrice  *int    `json:"max_price"`
	TotalUsed *int    `json:"total_used"`
	Name      *string `json:"name"`
	Status    *bool   `json:"status"`
	Limit     *int    `json:"limit"`
	Page      *int    `json:"page"`
}

type UpdateCouponValidator struct {
	Status *bool `json:"status"`
}

type ConditionCouponValidator struct {
	ConditionId uuid.UUID `json:"condition_id" validate:"required"`
}
