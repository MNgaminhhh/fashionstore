package repository

import (
	"backend/global"
	"backend/internal/database"
	"backend/internal/validator"
	"database/sql"
)

type ICategoryRepository interface {
	AddNewCategory(customParam validator.AddCategoryRequest) error
	AddNewSubCategory(customParam validator.AddSubCateRequest) error
}

type CategoryRepository struct {
	sqlc *database.Queries
}

func NewCategoryRepository() ICategoryRepository {
	return &CategoryRepository{
		sqlc: database.New(global.Mdb),
	}
}

func (cr *CategoryRepository) AddNewCategory(customParam validator.AddCategoryRequest) error {
	component := database.ComponentsType(customParam.Component)
	param := database.AddCategoryParams{
		Name:     customParam.Name,
		NameCode: customParam.NameCode,
		Icon: sql.NullString{
			String: customParam.Icon,
			Valid:  true,
		},
		Component: database.NullComponentsType{
			ComponentsType: component,
			Valid:          true,
		},
	}
	err := cr.sqlc.AddCategory(ctx, param)
	if err != nil {
		return err
	}
	return nil
}

func (cr *CategoryRepository) AddNewSubCategory(customParam validator.AddSubCateRequest) error {
	component := database.ComponentsType(customParam.Component)
	param := database.AddSubcategoryParams{
		Name:     customParam.CateName,
		Name_2:   customParam.Name,
		NameCode: customParam.NameCode,
		Component: database.NullComponentsType{
			ComponentsType: component,
			Valid:          true,
		},
	}
	err := cr.sqlc.AddSubcategory(ctx, param)
	if err != nil {
		return err
	}
	return nil
}
