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
