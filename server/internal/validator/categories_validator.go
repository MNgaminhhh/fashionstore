package validator

type AddCategoryRequest struct {
	Name      string `json:"name" validate:"required"`
	NameCode  string `json:"name_code" validate:"required"`
	Icon      string `json:"icon" validate:"required"`
	Component string `json:"component" validate:"required,oneof=MegaMenu1.name MegaMenu2.name"`
	Url       string `json:"url" validate:"required"`
}

type AddSubCateRequest struct {
	CateName  string `json:"cate_name" validate:"required"`
	Name      string `json:"name" validate:"required"`
	NameCode  string `json:"name_code" validate:"required"`
	Component string `json:"component" validate:"required,oneof=MegaMenu1.name MegaMenu2.name"`
	Url       string `json:"url" validate:"required"`
}

type AddChildCateRequest struct {
	SubCateId string `json:"sub_cate_id" validate:"required"`
	Name      string `json:"name" validate:"required"`
	NameCode  string `json:"name_code" validate:"required"`
	Url       string `json:"url" validate:"required"`
}

type FilterCategoryRequest struct {
	Name       string `json:"name"`
	NameCode   string `json:"name_code"`
	Url        string `json:"url"`
	Status     *int   `json:"status"`
	ParentId   string `json:"parent_id"`
	Limit      *int   `json:"limit"`
	Page       *int   `json:"page"`
	ParentName string `json:"parent_name"`
}

type UpdateCategoryRequest struct {
	Name      *string `json:"name"`
	NameCode  *string `json:"name_code"`
	Icon      *string `json:"icon"`
	Component *string `json:"component"`
	Status    *int    `json:"status"`
	Parent    *string `json:"parent"`
}
