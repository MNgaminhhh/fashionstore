package validator

type AddBannerRequest struct {
	Title       string  `json:"title" validate:"required"`
	BannerImage string  `json:"banner_image" validate:"required"`
	Description *string `json:"description"`
	ButtonText  string  `json:"button_text" validate:"required"`
	ButtonLink  *string `json:"button_link"`
	Serial      int     `json:"Serial" validate:"required"`
}

type UpdateBannerRequest struct {
	Title       string  `json:"title"`
	Description string  `json:"description"`
	ButtonText  string  `json:"button_text"`
	ButtonLink  *string `json:"button_link"`
	Serial      int     `json:"Serial"`
	Status      int     `json:"Status" validate:"oneof=0 1"`
}
