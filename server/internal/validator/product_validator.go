package validator

type AddProductRequest struct {
	Name            string   `json:"name" validate:"required"`
	Slug            string   `json:"slug" validate:"required"`
	Images          []string `json:"images" validate:"required,dive,url"`
	VendorID        string   `json:"vendor_id" validate:"required,uuid"`
	CategoryID      string   `json:"category_id" validate:"required,uuid"`
	SubCategoryID   *string  `json:"sub_category_id" validate:"omitempty,uuid"`
	ChildCategoryID *string  `json:"child_category_id" validate:"omitempty,uuid"`
	Qty             int      `json:"qty" validate:"gte=0"`
	ShortDesc       *string  `json:"short_description"`
	LongDesc        *string  `json:"long_description"`
	SKU             string   `json:"sku" validate:"required"`
	Price           int64    `json:"price" validate:"required,gte=0"`
	OfferPrice      *int64   `json:"offer_price" validate:"omitempty,gte=0"`
	OfferStartDate  *string  `json:"offer_start_date" validate:"omitempty,datetime=2006-01-02T15:04:05Z07:00"`
	OfferEndDate    *string  `json:"offer_end_date" validate:"omitempty,datetime=2006-01-02T15:04:05Z07:00"`
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
	Qty             *int      `json:"qty" validate:"omitempty,gte=0"`
	ShortDesc       *string   `json:"short_description"`
	LongDesc        *string   `json:"long_description"`
	SKU             *string   `json:"sku" validate:"omitempty"`
	Price           *int64    `json:"price" validate:"omitempty,gte=0"`
	OfferPrice      *int64    `json:"offer_price" validate:"omitempty,gte=0"`
	OfferStartDate  *string   `json:"offer_start_date" validate:"omitempty,datetime=2006-01-02T15:04:05Z07:00"`
	OfferEndDate    *string   `json:"offer_end_date" validate:"omitempty,datetime=2006-01-02T15:04:05Z07:00"`
	ProductType     *string   `json:"product_type"`
	Status          *string   `json:"status" validate:"omitempty,oneof=inactive active"`
	IsApproved      *bool     `json:"is_approved"`
}

type FilterProductRequest struct {
	StoreName   *string `query:"store_name"`
	Status      *string `query:"status"`
	Price       *int64  `query:"price"`
	SKU         *string `query:"sku"`
	Name        *string `query:"name"`
	ProductType *string `query:"product_type"`
	Limit       *int    `query:"limit"`
	Page        *int    `query:"page"`
}
