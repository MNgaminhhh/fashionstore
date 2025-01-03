package validator

type CreateShippingRuleValidator struct {
	Name         string `json:"name" validate:"required"`
	Price        *int   `json:"price"`
	MinOrderCost *int   `json:"minOrderCost"`
	Status       *bool  `json:"status"`
}

type FilterUpdateShippingRuleValidator struct {
	Name         *string `json:"name"`
	Status       *bool   `json:"status"`
	MinOrderCost *int    `json:"minOrderCost"`
	Price        *int    `json:"price"`
	Page         *int    `json:"page"`
	Limit        *int    `json:"limit"`
}
