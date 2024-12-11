package validator

type CreateDeliveryInfoValidator struct {
	ReceiverName string `json:"receiver_name" validate:"required"`
	PhoneNumber  string `json:"phone_number" validate:"required,min=10,max=10"`
	Email        string `json:"email" validate:"required,email"`
	Address      string `json:"address" validate:"required"`
}

type UpdateDeliveryInfoValidator struct {
	ReceiverName *string `json:"receiver_name"`
	PhoneNumber  *string `json:"phone_number" validate:"min=10,max=10"`
	Email        *string `json:"email" validate:"email"`
	Address      *string `json:"address"`
}
