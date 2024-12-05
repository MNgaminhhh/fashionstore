package validator

type CreateShippingRuleValidator struct {
	Name         string `json:"name" validate:"required"`
	Price        int    `json:"price" validate:"required"`
	MinOrderCost int    `json:"minOrderCost" validate:"required"`
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
