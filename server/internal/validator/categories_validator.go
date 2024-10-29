package validator

type AddCategoryRequest struct {
	Name      string `json:"name" validate:"required"`
	NameCode  string `json:"name_code" validate:"required"`
	Icon      string `json:"icon" validate:"required"`
	Component string `json:"component" validate:"required,oneof=MegaMenu1.name MegaMenu2.name"`
}

type AddSubCateRequest struct {
	CateName  string `json:"cate_name" validate:"required"`
	Name      string `json:"name" validate:"required"`
	NameCode  string `json:"name_code" validate:"required"`
	Component string `json:"component" validate:"required,oneof=MegaMenu1.name MegaMenu2.name"`
}
