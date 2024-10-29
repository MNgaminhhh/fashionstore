package validator

type FilterBrandsRequest struct {
	Visible *bool  `query:"visible"`
	Name    string `query:"name"`
	Limit   int    `query:"limit"`
	Page    int    `query:"page"`
}
