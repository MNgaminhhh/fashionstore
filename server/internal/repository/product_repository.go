// File: internal/repository/product_repository.go

package repository

import (
	"backend/global"
	"backend/internal/database"
	"backend/internal/utils"
	"backend/internal/validator"
	"database/sql"
	"errors"
	"github.com/google/uuid"
	"log"
)

type IProductRepository interface {
	AddProduct(customParam validator.AddProductRequest, vendorId uuid.UUID) error
	GetProductByID(id uuid.UUID) (*database.Product, error)
	UpdateProduct(customParam *database.Product) error
	DeleteProductByID(id uuid.UUID) error
	ListProducts(filter database.ListProductsParams) ([]database.ListProductsRow, error)
}

type ProductRepository struct {
	sqlc *database.Queries
}

func NewProductRepository() IProductRepository {
	return &ProductRepository{
		sqlc: database.New(global.Mdb),
	}
}

func (pr *ProductRepository) AddProduct(customParam validator.AddProductRequest, vendorId uuid.UUID) error {
	log.Println(customParam)
	imagesJSON := utils.MarshalImages(customParam.Images)
	categoryID := utils.OptionalUUID(uuid.MustParse(customParam.CategoryID), customParam.CategoryID != "")
	subCategoryID := utils.OptionalNullUUID(customParam.SubCategoryID)
	childCategoryID := utils.OptionalNullUUID(customParam.ChildCategoryID)

	shortDesc := utils.OptionalNullString(customParam.ShortDesc)
	longDesc := utils.OptionalNullString(customParam.LongDesc)
	statusPtr := &customParam.Status
	if customParam.Status == "" {
		statusPtr = nil
	}

	status := utils.OptionalNullProductStatus(statusPtr)
	if !status.Valid {
		status = database.NullProductStatus{
			ProductStatus: "active",
			Valid:         true,
		}
	}
	isApproved := utils.OptionalNullBool(customParam.IsApproved)

	params := database.AddProductParams{
		Name:             customParam.Name,
		Slug:             customParam.Slug,
		Images:           imagesJSON,
		VendorID:         vendorId,
		CategoryID:       categoryID,
		SubCategoryID:    subCategoryID,
		ChildCategoryID:  childCategoryID,
		ShortDescription: shortDesc,
		LongDescription:  longDesc,
		ProductType:      utils.OptionalNullString(&customParam.ProductType),
		Status:           status,
		IsApproved:       isApproved,
	}
	_, err := pr.sqlc.AddProduct(ctx, params)
	if err != nil {
		return err
	}
	return nil
}

func (pr *ProductRepository) GetProductByID(id uuid.UUID) (*database.Product, error) {
	product, err := pr.sqlc.GetProductByID(ctx, id)
	return &product, err
}

func (ps *ProductRepository) UpdateProduct(customParam *database.Product) error {
	params := database.UpdateProductParams{
		ID:               customParam.ID,
		Name:             customParam.Name,
		Slug:             customParam.Slug,
		Images:           customParam.Images,
		VendorID:         customParam.VendorID,
		CategoryID:       customParam.CategoryID,
		SubCategoryID:    customParam.SubCategoryID,
		ChildCategoryID:  customParam.ChildCategoryID,
		ShortDescription: customParam.ShortDescription,
		LongDescription:  customParam.LongDescription,
		ProductType:      customParam.ProductType,
		Status:           customParam.Status,
		IsApproved:       customParam.IsApproved,
	}

	err := ps.sqlc.UpdateProduct(ctx, params)
	if err != nil {
		return err
	}
	return nil
}

func (pr *ProductRepository) DeleteProductByID(id uuid.UUID) error {
	err := pr.sqlc.DeleteProduct(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			log.Fatalf("product not found")
		}
		log.Fatalf("failed to delete product: " + err.Error())
	}
	return nil
}

func (pr *ProductRepository) ListProducts(filter database.ListProductsParams) ([]database.ListProductsRow, error) {
	products, err := pr.sqlc.ListProducts(ctx, filter)
	log.Println(filter)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	return products, nil
}
