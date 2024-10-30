package validator

type FilterBrandsRequest struct {
	Visible *bool  `query:"visible"`
	Name    string `query:"name"`
	Limit   int    `query:"limit"`
	Page    int    `query:"page"`
}

type UpdateBrandRequest struct {
	Visible  *bool   `json:"visible"`
	Name     *string `json:"name"`
	Sequence *int    `json:"sequence"`
	Image    *string `json:"image"`
}
