package validator

type AddProductRequest struct {
	Name            string   `json:"name" validate:"required"`
	Slug            string   `json:"slug" validate:"required"`
	Images          []string `json:"images" validate:"required,dive,url"`
	CategoryID      string   `json:"category_id" validate:"required,uuid"`
	SubCategoryID   *string  `json:"sub_category_id" validate:"omitempty,uuid"`
	ChildCategoryID *string  `json:"child_category_id" validate:"omitempty,uuid"`
	ShortDesc       *string  `json:"short_description"`
	LongDesc        *string  `json:"long_description"`
	ProductType     string   `json:"product_type"`
	Status          string   `json:"status" validate:"oneof=inactive active"`
	IsApproved      *bool    `json:"is_approved"`
}

type UpdateProductRequest struct {
	Name            *string   `json:"name" validate:"omitempty"`
	Slug            *string   `json:"slug" validate:"omitempty"`
	Images          *[]string `json:"images" validate:"omitempty,dive,url"`
	VendorID        *string   `json:"vendor_id" validate:"omitempty,uuid"`
	CategoryID      *string   `json:"category_id" validate:"omitempty,uuid"`
	SubCategoryID   *string   `json:"sub_category_id" validate:"omitempty,uuid"`
	ChildCategoryID *string   `json:"child_category_id" validate:"omitempty,uuid"`
	ShortDesc       *string   `json:"short_description"`
	LongDesc        *string   `json:"long_description"`
	ProductType     *string   `json:"product_type"`
	Status          *string   `json:"status" validate:"omitempty,oneof=inactive active"`
	IsApproved      *bool     `json:"is_approved"`
}

type FilterProductRequest struct {
	StoreName   *string `query:"store_name"`
	Status      *string `query:"status"`
	Name        *string `query:"name"`
	ProductType *string `query:"product_type"`
	Limit       *int    `query:"limit"`
	Page        *int    `query:"page"`
	LowPrice    *int    `query:"low_price"`
	HighPrice   *int    `query:"high_price"`
	CateName    *string `query:"cate_name"`
	VendorId    *string
}
