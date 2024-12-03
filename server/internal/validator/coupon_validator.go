package validator

type CreateConditionValidator struct {
	Field    string `json:"field" validate:"required,oneof=price shipping_cost"`
	Operator string `json:"operator" validate:"required,oneof=> = >="`
	Value    string `json:"value" validate:"required"`
}

type CreateCouponValidator struct {
	Code      string `json:"code" validate:"required"`
	Quantity  int    `json:"quantity" validate:"required"`
	StartDate string `json:"start_date" validate:"required"`
	EndDate   string `json:"end_date" validate:"required"`
	Type      string `json:"type" validate:"required,oneof=shipping fixed percentage"`
	Discount  int    `json:"discount" validate:"required"`
	MaxPrice  int    `json:"max_price" validate:"required"`
	TotalUsed int    `json:"total_used" validate:"required"`
	Name      string `json:"name" validate:"required"`
	Field     string `json:"field" validate:"required,oneof=price shipping_cost"`
	Operator  string `json:"operator" validate:"required,oneof=> = >="`
	Value     string `json:"value" validate:"required"`
}
