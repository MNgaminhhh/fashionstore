package validator

type BecomeVendorRequest struct {
	FullName    string `json:"full_name" validate:"required"`
	Email       string `json:"email" validate:"required,email"`
	PhoneNumber string `json:"phone_number" validate:"required,number"`
	StoreName   string `json:"store_name" validate:"required"`
	Banner      string `json:"banner" validate:"required"`
	Description string `json:"description"`
	Address     string `json:"address" validate:"required"`
}

type AdminUpdateVendorStatusRequest struct {
	UserId string `json:"user_id" validate:"required"`
	Status string `json:"status" validate:"required,oneof=pending accepted rejected"`
}

type FilterVendorRequest struct {
	Status      string `query:"status"`
	FullName    string `query:"full_name"`
	StoreName   string `query:"store_name"`
	Description string `query:"description"`
	Address     string `query:"address"`
	Limit       int    `query:"limit"`
	Page        int    `query:"page"`
}

type UpdateVendorRequest struct {
	FullName    *string `json:"full_name"`
	Email       *string `json:"email"`
	PhoneNumber *string `json:"phone_number"`
	StoreName   *string `json:"store_name"`
	Banner      *string `json:"banner"`
	Description *string `json:"description"`
	Address     *string `json:"address"`
}
