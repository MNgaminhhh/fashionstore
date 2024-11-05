package repository

import (
	"backend/global"
	"backend/internal/database"
	"backend/internal/validator"
	"database/sql"
	"github.com/google/uuid"
	"log"
)

type ICategoryRepository interface {
	AddNewCategory(customParam validator.AddCategoryRequest) error
	AddNewSubCategory(customParam validator.AddSubCateRequest) error
	AddChildCate(customParam validator.AddChildCateRequest) error
	GetFullCate() ([]database.GetFullCategoriesRow, error)
	GetAllCategories(customParam *validator.FilterCategoryRequest) ([]database.Category, error)
	GetCategoryById(id uuid.UUID) (*database.Category, error)
	DeleteCategoryById(id uuid.UUID) error
	UpdateCategoryById(newCate *database.Category) error
	GetAllSubCategories(customParam *validator.FilterCategoryRequest) ([]database.FindALlSubCategoriesRow, error)
	GetSubCategoryById(id uuid.UUID) (*database.FindSubCategoryByIdRow, error)
	DeleteSubCategoryById(id uuid.UUID) error
	UpdateSubCategoryById(newSubCate *database.FindSubCategoryByIdRow) error
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

func (cr *CategoryRepository) AddChildCate(customParam validator.AddChildCateRequest) error {
	subId, _ := uuid.Parse(customParam.SubCateId)
	param := database.AddChildCategoryParams{
		SubCategoryID: uuid.NullUUID{
			UUID:  subId,
			Valid: true,
		},
		Name:     customParam.Name,
		NameCode: customParam.NameCode,
	}
	err := cr.sqlc.AddChildCategory(ctx, param)
	if err != nil {
		return err
	}
	return nil
}

func (cr *CategoryRepository) GetFullCate() ([]database.GetFullCategoriesRow, error) {
	rows, err := cr.sqlc.GetFullCategories(ctx)
	log.Println(len(rows))
	if err != nil {
		return nil, err
	}
	return rows, nil
}

func (cr *CategoryRepository) GetAllCategories(customParam *validator.FilterCategoryRequest) ([]database.Category, error) {
	param := database.FindAllCategoriesParams{
		Column1: sql.NullString{
			String: customParam.Name,
			Valid:  customParam.Name != "",
		},
		Column2: sql.NullString{
			String: customParam.NameCode,
			Valid:  customParam.NameCode != "",
		},
		Column3: sql.NullString{
			String: customParam.Url,
			Valid:  customParam.Url != "",
		},
		Status: sql.NullInt32{
			Int32: -1,
			Valid: true,
		},
	}
	if customParam.Status != nil {
		param.Status = sql.NullInt32{
			Int32: int32(*customParam.Status),
			Valid: true,
		}
	}
	log.Println(param)
	cates, err := cr.sqlc.FindAllCategories(ctx, param)
	if err != nil {
		return nil, err
	}
	return cates, nil
}

func (cr *CategoryRepository) GetCategoryById(id uuid.UUID) (*database.Category, error) {
	cate, err := cr.sqlc.FindCategoryById(ctx, id)
	if err != nil {
		return nil, err
	}
	return &cate, nil
}

func (cr *CategoryRepository) DeleteCategoryById(id uuid.UUID) error {
	err := cr.sqlc.DeleteCategoryById(ctx, id)
	return err
}

func (cr *CategoryRepository) UpdateCategoryById(newCate *database.Category) error {
	param := database.UpdateCategoryByIdParams{
		Name:      newCate.Name,
		NameCode:  newCate.NameCode,
		Icon:      newCate.Icon,
		Component: newCate.Component,
		Status:    newCate.Status,
		ID:        newCate.ID,
	}
	err := cr.sqlc.UpdateCategoryById(ctx, param)
	return err
}

func (cr *CategoryRepository) GetAllSubCategories(customParam *validator.FilterCategoryRequest) ([]database.FindALlSubCategoriesRow, error) {
	param := database.FindALlSubCategoriesParams{
		Column1: sql.NullString{
			String: customParam.Url,
			Valid:  customParam.Url != "",
		},
		Column2: sql.NullString{
			String: customParam.Name,
			Valid:  customParam.Name != "",
		},
		Column3: sql.NullString{
			String: customParam.NameCode,
			Valid:  customParam.NameCode != "",
		},
		Status: sql.NullInt32{
			Int32: -1,
			Valid: true,
		},
		Column5: sql.NullString{
			String: customParam.ParentName,
			Valid:  customParam.ParentName != "",
		},
	}
	if customParam.Status != nil {
		param.Status = sql.NullInt32{
			Int32: int32(*customParam.Status),
			Valid: true,
		}
	}
	subCates, err := cr.sqlc.FindALlSubCategories(ctx, param)
	if err != nil {
		return nil, err
	}
	return subCates, nil
}

func (cr *CategoryRepository) GetSubCategoryById(id uuid.UUID) (*database.FindSubCategoryByIdRow, error) {
	subCate, err := cr.sqlc.FindSubCategoryById(ctx, id)
	if err != nil {
		return nil, err
	}
	return &subCate, err
}

func (cr *CategoryRepository) DeleteSubCategoryById(id uuid.UUID) error {
	err := cr.sqlc.DeleteSubCategoryById(ctx, id)
	return err
}

func (cr *CategoryRepository) UpdateSubCategoryById(newSubCate *database.FindSubCategoryByIdRow) error {
	param := database.UpdateSubCategoryByIdParams{
		Name:       newSubCate.Name,
		NameCode:   newSubCate.NameCode,
		Component:  newSubCate.Component,
		CategoryID: newSubCate.CategoryID,
		ID:         newSubCate.ID,
	}
	err := cr.sqlc.UpdateSubCategoryById(ctx, param)
	return err
}
