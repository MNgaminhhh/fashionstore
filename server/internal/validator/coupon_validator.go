package validator

type CreateConditionValidator struct {
	Field    string `json:"field" validate:"required,oneof=price shipping_cost"`
	Operator string `json:"operator" validate:"required,oneof=> = >="`
	Value    string `json:"value" validate:"required"`
}
