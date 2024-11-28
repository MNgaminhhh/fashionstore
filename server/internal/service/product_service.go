package service

import (
	"backend/internal"
	"backend/internal/database"
	"backend/internal/repository"
	"backend/internal/validator"
	"backend/pkg/response"
	"database/sql"
	"encoding/json"
	"errors"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

type ProductResponse struct {
	ID               uuid.UUID  `json:"id"`
	Name             string     `json:"name"`
	Slug             string     `json:"slug"`
	Images           []string   `json:"images"`
	VendorID         uuid.UUID  `json:"vendor_id"`
	CategoryID       uuid.UUID  `json:"category_id"`
	SubCategoryID    *uuid.UUID `json:"sub_category_id,omitempty"`
	ChildCategoryID  *uuid.UUID `json:"child_category_id,omitempty"`
	ShortDescription string     `json:"short_description,omitempty"`
	LongDescription  string     `json:"long_description,omitempty"`
	ProductType      string     `json:"product_type,omitempty"`
	Status           string     `json:"status"`
	IsApproved       bool       `json:"is_approved"`
	StoreName        string     `json:"store_name,omitempty"`
	CategoryName     string     `json:"category_name,omitempty"`
	LowestPrice      int        `json:"lowest_price,omitempty"`
	HighestPrice     int        `json:"highest_price,omitempty"`
}

type IProductService interface {
	AddProduct(customParam validator.AddProductRequest, vendorId uuid.UUID) int
	GetProductByID(id string) (int, *ProductResponse)
	UpdateProduct(id string, customParam validator.UpdateProductRequest) int
	DeleteProductByID(id string) int
	ListProducts(filter *validator.FilterProductRequest) (int, map[string]interface{})
}

type ProductService struct {
	productRepo repository.IProductRepository
}

func NewProductService(productRepo repository.IProductRepository) IProductService {
	return &ProductService{productRepo: productRepo}
}

func (ps *ProductService) AddProduct(customParam validator.AddProductRequest, vendorId uuid.UUID) int {
	err := ps.productRepo.AddProduct(customParam, vendorId)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			switch pqErr.Code.Name() {
			case "unique_violation":
				return response.ErrCodeConflict
			case "foreign_key_violation":
				return response.ErrCodeForeignKey
			case "check_violation":
				return response.ErrCodeValidate
			default:
				return response.ErrCodeDatabase
			}
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (ps *ProductService) GetProductByID(id string) (int, *ProductResponse) {
	parsedID, _ := uuid.Parse(id)

	product, err := ps.productRepo.GetProductByID(parsedID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return response.ErrCodeProductNotFound, nil
		}
		return response.ErrCodeInternal, nil
	}

	responseData, err := mapProductToResponseData(product)
	if err != nil {
		return response.ErrCodeInternal, nil
	}

	return response.SuccessCode, responseData
}

func (ps *ProductService) UpdateProduct(id string, customParam validator.UpdateProductRequest) int {
	parsedID, _ := uuid.Parse(id)
	oldProduct, err := ps.productRepo.GetProductByID(parsedID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return response.ErrCodeProductNotFound
		}
		return response.ErrCodeInternal
	}
	if customParam.Name != nil {
		oldProduct.Name = *customParam.Name
	}
	if customParam.Slug != nil {
		oldProduct.Slug = *customParam.Slug
	}
	if customParam.Images != nil {
		imagesJSON, err := json.Marshal(*customParam.Images)
		if err != nil {
			return response.ErrCodeParamInvalid
		}
		oldProduct.Images = json.RawMessage(imagesJSON)
	}
	if customParam.VendorID != nil {
		vendorUUID, err := uuid.Parse(*customParam.VendorID)
		if err != nil {
			return response.ErrCodeParamInvalid
		}
		oldProduct.VendorID = vendorUUID
	}
	if customParam.CategoryID != nil {
		categoryID, err := uuid.Parse(*customParam.CategoryID)
		if err != nil {
			return response.ErrCodeParamInvalid
		}
		oldProduct.CategoryID = categoryID
	}
	if customParam.SubCategoryID != nil {
		subCategoryID, err := uuid.Parse(*customParam.SubCategoryID)
		if err != nil {
			return response.ErrCodeParamInvalid
		}
		oldProduct.SubCategoryID = uuid.NullUUID{UUID: subCategoryID, Valid: true}
	} else {
		oldProduct.SubCategoryID = uuid.NullUUID{Valid: false}
	}

	if customParam.ChildCategoryID != nil {
		childCategoryID, err := uuid.Parse(*customParam.ChildCategoryID)
		if err != nil {
			return response.ErrCodeParamInvalid
		}
		oldProduct.ChildCategoryID = uuid.NullUUID{UUID: childCategoryID, Valid: true}
	} else {
		oldProduct.ChildCategoryID = uuid.NullUUID{Valid: false}
	}
	if customParam.ShortDesc != nil {
		oldProduct.ShortDescription = sql.NullString{String: *customParam.ShortDesc, Valid: true}
	} else {
		oldProduct.ShortDescription = sql.NullString{Valid: false}
	}
	if customParam.LongDesc != nil {
		oldProduct.LongDescription = sql.NullString{String: *customParam.LongDesc, Valid: true}
	} else {
		oldProduct.LongDescription = sql.NullString{Valid: false}
	}
	if customParam.ProductType != nil {
		oldProduct.ProductType = sql.NullString{String: *customParam.ProductType, Valid: true}
	} else {
		oldProduct.ProductType = sql.NullString{Valid: false}
	}
	if customParam.Status != nil {
		oldProduct.Status = database.NullProductStatus{ProductStatus: database.ProductStatus(*customParam.Status), Valid: true}
	} else {
		oldProduct.Status = database.NullProductStatus{Valid: false}
	}
	if customParam.IsApproved != nil {
		oldProduct.IsApproved = sql.NullBool{Bool: *customParam.IsApproved, Valid: true}
	} else {
		oldProduct.IsApproved = sql.NullBool{Valid: false}
	}

	err = ps.productRepo.UpdateProduct(oldProduct)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			switch pqErr.Code.Name() {
			case "unique_violation":
				return response.ErrCodeConflict
			case "foreign_key_violation":
				return response.ErrCodeForeignKey
			case "check_violation":
				return response.ErrCodeValidate
			default:
				return response.ErrCodeDatabase
			}
		}
		return response.ErrCodeInternal
	}

	return response.SuccessCode
}

func (ps *ProductService) DeleteProductByID(id string) int {
	parsedID, err := uuid.Parse(id)
	if err != nil {
		return response.ErrCodeParamInvalid
	}

	err = ps.productRepo.DeleteProductByID(parsedID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return response.ErrCodeProductNotFound
		}
		return response.ErrCodeInternal
	}

	return response.SuccessCode
}

func (ps *ProductService) ListProducts(filter *validator.FilterProductRequest) (int, map[string]interface{}) {
	storeName := sql.NullString{}
	skusRepo := repository.NewSkusRepository()
	if filter.StoreName != nil && *filter.StoreName != "" {
		storeName = sql.NullString{String: *filter.StoreName, Valid: true}
	}
	name := sql.NullString{}
	if filter.Name != nil && *filter.Name != "" {
		name = sql.NullString{String: *filter.Name, Valid: true}
	}
	productType := sql.NullString{}
	if filter.ProductType != nil && *filter.ProductType != "" {
		productType = sql.NullString{String: *filter.ProductType, Valid: true}
	}
	status := database.NullProductStatus{}
	if filter.Status != nil && *filter.Status != "" {
		status = database.NullProductStatus{
			ProductStatus: database.ProductStatus(*filter.Status),
			Valid:         true,
		}
	} else {
		status = database.NullProductStatus{Valid: false}
	}
	params := database.ListProductsParams{
		Column1: storeName,
		Column2: name,
		Column3: productType,
		Status:  status,
	}
	products, err := ps.productRepo.ListProducts(params)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			log.Println(err)
			switch pqErr.Code.Name() {
			case "unique_violation":
				return response.ErrCodeConflict, nil
			case "foreign_key_violation":
				return response.ErrCodeForeignKey, nil
			case "check_violation":
				return response.ErrCodeValidate, nil
			default:
				return response.ErrCodeDatabase, nil
			}
		}
		return response.ErrCodeInternal, nil
	}
	limit := len(products)
	page := 1
	if filter.Limit != nil {
		limit = *filter.Limit
	}
	if filter.Page != nil {
		page = *filter.Page
	}
	totalResults := len(products)
	totalPages := internal.CalculateTotalPages(totalResults, limit)
	products = internal.Paginate(products, page, limit)
	var responseData []ProductResponse
	var productsWithSkus []map[string]interface{}
	for _, product := range products {
		resData, _ := mapListProductsRowToResponse(&product)
		skus, getSkusErr := skusRepo.GetAllSkusByProductId(resData.ID)
		if getSkusErr != nil {
			return response.ErrCodeInternal, nil
		}
		if skus != nil && len(skus) > 0 {

			resData.LowestPrice = int(skus[0].Price)
			resData.HighestPrice = int(skus[len(skus)-1].Price)
			responseData = append(responseData, *resData)
		}

		mapData := map[string]interface{}{
			"product": resData,
			"skus":    skus,
		}
		productsWithSkus = append(productsWithSkus, mapData)
	}

	results := map[string]interface{}{
		"products":      productsWithSkus,
		"total_pages":   totalPages,
		"total_results": totalResults,
	}

	return response.SuccessCode, results
}
func mapListProductsRowToResponse(row *database.ListProductsRow) (*ProductResponse, error) {
	var images []string
	err := json.Unmarshal(row.Images, &images)
	if err != nil {
		return nil, err
	}

	return &ProductResponse{
		ID:               row.ID,
		Name:             row.Name,
		Slug:             row.Slug,
		Images:           images,
		VendorID:         row.VendorID,
		CategoryID:       row.CategoryID,
		SubCategoryID:    getNullableUUID(row.SubCategoryID),
		ChildCategoryID:  getNullableUUID(row.ChildCategoryID),
		ShortDescription: row.ShortDescription.String,
		LongDescription:  row.LongDescription.String,
		ProductType:      row.ProductType.String,
		Status:           string(row.Status.ProductStatus),
		IsApproved:       row.IsApproved.Bool,
		StoreName:        row.StoreName.String,
		CategoryName:     row.CategoryName.String,
	}, nil
}

func mapProductToResponseData(product *database.Product) (*ProductResponse, error) {
	var images []string
	err := json.Unmarshal(product.Images, &images)
	if err != nil {
		return nil, err
	}

	return &ProductResponse{
		ID:               product.ID,
		Name:             product.Name,
		Slug:             product.Slug,
		Images:           images,
		VendorID:         product.VendorID,
		CategoryID:       product.CategoryID,
		SubCategoryID:    getNullableUUID(product.SubCategoryID),
		ChildCategoryID:  getNullableUUID(product.ChildCategoryID),
		ShortDescription: product.ShortDescription.String,
		LongDescription:  product.LongDescription.String,
		ProductType:      product.ProductType.String,
		Status:           string(product.Status.ProductStatus),
		IsApproved:       product.IsApproved.Bool,
	}, nil
}

func getNullableInt64(i sql.NullInt64) *int64 {
	if i.Valid {
		return &i.Int64
	}
	return nil
}

func getNullableUUID(u uuid.NullUUID) *uuid.UUID {
	if u.Valid {
		return &u.UUID
	}
	return nil
}

func getNullableTime(t sql.NullTime) *time.Time {
	if t.Valid {
		return &t.Time
	}
	return nil
}
