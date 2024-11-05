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

type AddChildCateRequest struct {
	SubCateId string `json:"sub_cate_id" validate:"required"`
	Name      string `json:"name" validate:"required"`
	NameCode  string `json:"name_code" validate:"required"`
}

type FilterCategoryRequest struct {
	Name     string `json:"name"`
	NameCode string `json:"name_code"`
	Url      string `json:"url"`
	Status   *int   `json:"status"`
	Limit    *int   `json:"limit"`
	Offset   *int   `json:"offset"`
}

type UpdateCategoryRequest struct {
	Name      *string `json:"name"`
	NameCode  *string `json:"name_code"`
	Icon      *string `json:"icon"`
	Component *string `json:"component" validate:"oneof=MegaMenu1.name MegaMenu2.name"`
	Status    *int    `json:"status" validate:"oneof=0 1"`
}
