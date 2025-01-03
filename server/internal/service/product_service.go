package service

import (
	"backend/internal"
	"backend/internal/database"
	"backend/internal/pg_error"
	"backend/internal/repository"
	"backend/internal/validator"
	"backend/pkg/response"
	"database/sql"
	"encoding/json"
	"errors"
	"log"
	"slices"
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

type ProductResponse struct {
	ID               uuid.UUID                `json:"id"`
	Name             string                   `json:"name"`
	Slug             string                   `json:"slug,omitempty"`
	Images           []string                 `json:"images"`
	VendorID         string                   `json:"vendor_id,omitempty"`
	CategoryID       string                   `json:"category_id,omitempty"`
	SubCategoryID    string                   `json:"sub_category_id,omitempty"`
	ChildCategoryID  string                   `json:"child_category_id,omitempty"`
	ShortDescription string                   `json:"short_description,omitempty"`
	LongDescription  string                   `json:"long_description,omitempty"`
	ProductType      string                   `json:"product_type,omitempty"`
	Status           string                   `json:"status,omitempty"`
	IsApproved       bool                     `json:"is_approved"`
	StoreName        string                   `json:"store_name,omitempty"`
	CategoryName     string                   `json:"category_name,omitempty"`
	SubCateName      string                   `json:"sub_cate_name,omitempty"`
	ChildCateName    string                   `json:"child_cate_name,omitempty"`
	LowestPrice      int                      `json:"lowest_price,omitempty"`
	HighestPrice     int                      `json:"highest_price,omitempty"`
	RatingPoint      float64                  `json:"review_point"`
	Variants         json.RawMessage          `json:"variants,omitempty"`
	Options          json.RawMessage          `json:"options,omitempty"`
	Vendor           map[string]interface{}   `json:"vendor,omitempty"`
	Skus             []map[string]interface{} `json:"skus,omitempty"`
	Reviews          []map[string]interface{} `json:"reviews,omitempty"`
	ShowFlashSale    *bool                    `json:"show,omitempty"`
}

type ProductWithSkus struct {
	Product *database.ViewFullDetailOfProductRow
	Skus    []database.GetAllSkuByProductIdRow
	Reviews []database.GetAllReviewsByProductIdRow
}

type IProductService interface {
	AddProduct(customParam validator.AddProductRequest, vendorId uuid.UUID) int
	GetProductByID(id string) (int, *ProductResponse)
	ViewFullDetailOfProduct(slug string) (int, *ProductResponse)
	UpdateProduct(id string, customParam validator.UpdateProductRequest) int
	DeleteProductByID(id string) int
	ListProducts(filter *validator.FilterProductRequest) (int, map[string]interface{})
	GetAllProductOfVendor(filter *validator.FilterProductRequest) (int, map[string]interface{})
	GetAllProductFlashSale(filter validator.FilterProductRequest) (int, map[string]interface{})
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
			return pg_error.GetMessageError(pqErr)
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

func (ps *ProductService) ViewFullDetailOfProduct(slug string) (int, *ProductResponse) {
	product, err := ps.productRepo.ViewFullDetailOfProduct(slug)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr), nil
		}
		return response.ErrCodeNoContent, nil
	}
	skusRepo := repository.NewSkusRepository()
	skus, findSkusErr := skusRepo.GetAllSkusByProductId(product.ID)
	if findSkusErr != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr), nil
		}
		log.Println(err)
		return response.ErrCodeInternal, nil
	}
	reviewsRepo := repository.NewReviewsRepository()
	reviews, _ := reviewsRepo.GetAllReviewsByProductId(product.ID)
	productWithSkus := ProductWithSkus{
		Product: product,
		Skus:    skus,
		Reviews: reviews,
	}
	resData, _ := mapProductToResponseData(&productWithSkus)
	return response.SuccessCode, resData
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
	}

	if customParam.ChildCategoryID != nil {
		childCategoryID, err := uuid.Parse(*customParam.ChildCategoryID)
		if err != nil {
			return response.ErrCodeParamInvalid
		}
		oldProduct.ChildCategoryID = uuid.NullUUID{UUID: childCategoryID, Valid: true}
	}
	if customParam.ShortDesc != nil {
		oldProduct.ShortDescription = sql.NullString{String: *customParam.ShortDesc, Valid: true}
	}
	if customParam.LongDesc != nil {
		oldProduct.LongDescription = sql.NullString{String: *customParam.LongDesc, Valid: true}
	}
	if customParam.ProductType != nil {
		oldProduct.ProductType = sql.NullString{String: *customParam.ProductType, Valid: true}
	}
	if customParam.Status != nil {
		oldProduct.Status = database.NullProductStatus{ProductStatus: database.ProductStatus(*customParam.Status), Valid: true}
	}
	if customParam.IsApproved != nil {
		oldProduct.IsApproved = sql.NullBool{Bool: *customParam.IsApproved, Valid: true}
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
	reviewsRepo := repository.NewReviewsRepository()
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
		Column1:    storeName,
		Column2:    name,
		Column3:    productType,
		Status:     status,
		Column5:    "",
		Column6:    sql.NullString{},
		IsApproved: sql.NullBool{},
		Column8:    sql.NullString{},
		Column9:    sql.NullString{},
		Column10: sql.NullString{},
		Column11: sql.NullString{},
		Column12: sql.NullString{},
	}
	if filter.VendorId != nil {
		params.Column5 = *filter.VendorId
	}
	if filter.CateName != nil && len(*filter.CateName) > 0 {
		params.Column6 = sql.NullString{
			String: *filter.CateName,
			Valid:  true,
		}
	}
	if filter.IsApproved != nil && *filter.IsApproved {
		params.IsApproved = sql.NullBool{Bool: true, Valid: true}
	}
	if filter.SubCateName != nil && len(*filter.SubCateName) > 0 {
		params.Column8 = sql.NullString{
			String: *filter.SubCateName,
			Valid:  true,
		}
	}
	if filter.ChildCateName != nil && len(*filter.ChildCateName) > 0 {
		params.Column9 = sql.NullString{
			String: *filter.ChildCateName,
			Valid:  true,
		}
	}
	if filter.ChildCateName != nil && len(*filter.ChildCateName) > 0 {
		params.Column9 = sql.NullString{
			String: *filter.ChildCateName,
			Valid:  true,
		}
	}

	if filter.CategorySlug != nil && len(*filter.CategorySlug) > 0 {
		params.Column10 = sql.NullString{
			String: *filter.CategorySlug,
			Valid:  true,
		}
	}

	if filter.SubCategorySlug != nil && len(*filter.SubCategorySlug) > 0 {
		params.Column11 = sql.NullString{
			String: *filter.SubCategorySlug,
			Valid:  true,
		}
	}

	if filter.ChildCategorySlug != nil && len(*filter.ChildCategorySlug) > 0 {
		params.Column12 = sql.NullString{
			String: *filter.ChildCategorySlug,
			Valid:  true,
		}
	}
	products, err := ps.productRepo.ListProducts(params)
	if err != nil {
		log.Println(err)
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
	for _, product := range products {
		resData, _ := mapListProductsRowToResponse(&product)
		skus, getSkusErr := skusRepo.GetAllSkusByProductId(resData.ID)
		if getSkusErr != nil {
			log.Println(getSkusErr)
			return response.ErrCodeInternal, nil
		}
		reviews, _ := reviewsRepo.GetAllReviewsByProductId(product.ID)
		ratingPoint := calculateRatingPoint(reviews)
		resData.RatingPoint = ratingPoint
		if skus != nil && len(skus) > 0 {
			lowestPrice, highestPrice := getLowestHighestPrice(skus)
			resData.LowestPrice = lowestPrice
			resData.HighestPrice = highestPrice
			if filter.LowPrice != nil && filter.HighPrice != nil {
				if resData.LowestPrice <= *filter.LowPrice || resData.HighestPrice >= *filter.HighPrice {
					continue
				}
			}
			responseData = append(responseData, *resData)
		}
	}

	results := map[string]interface{}{
		"products":      responseData,
		"total_pages":   totalPages,
		"total_results": totalResults,
		"page":          page,
		"limit":         limit,
	}

	return response.SuccessCode, results
}

func getLowestHighestPrice(skus []database.GetAllSkuByProductIdRow) (int, int) {
	var lowest, highest int
	var priceArr []int
	for _, sku := range skus {
		offerStartDate := sku.OfferStartDate.Time
		offerEndDate := sku.OfferEndDate.Time
		if time.Now().Before(offerStartDate) || time.Now().After(offerEndDate) {
			priceArr = append(priceArr, int(sku.Price))
		} else {
			priceArr = append(priceArr, int(sku.OfferPrice))
		}
	}
	lowest = slices.Min(priceArr)
	highest = slices.Max(priceArr)
	return lowest, highest
}

func (ps *ProductService) GetAllProductOfVendor(filter *validator.FilterProductRequest) (int, map[string]interface{}) {
	if filter.VendorId == nil {
		return response.ErrCodeUnauthorized, nil
	}
	params := database.ListProductsParams{}
	params.Column5 = *filter.VendorId
	if filter.Name != nil && *filter.Name != "" {
		params.Column2 = sql.NullString{String: *filter.Name, Valid: true}
	}
	if filter.Status != nil && *filter.Status != "" {
		params.Status = database.NullProductStatus{
			ProductStatus: database.ProductStatus(*filter.Status),
			Valid:         true,
		}
	}
	if filter.CateName != nil && *filter.CateName != "" {
		params.Column6 = sql.NullString{String: *filter.CateName, Valid: true}
	}
	if filter.ProductType != nil && *filter.ProductType != "" {
		params.Column3 = sql.NullString{String: *filter.ProductType, Valid: true}
	}
	if filter.IsApproved != nil {
		params.IsApproved = sql.NullBool{
			Bool:  *filter.IsApproved,
			Valid: true,
		}
	}
	products, err := ps.productRepo.ListProducts(params)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr), nil
		}
		return response.ErrCodeInternal, nil
	}
	totalResults := len(products)
	limit := len(products)
	page := 1
	if filter.Limit != nil {
		limit = *filter.Limit
	}
	if filter.Page != nil {
		page = *filter.Page
	}
	totalPages := internal.CalculateTotalPages(totalResults, limit)
	pagination := internal.Paginate(products, page, limit)
	var responseData []ProductResponse
	for _, product := range pagination {
		resData, _ := mapListProductsRowToResponse(&product)
		responseData = append(responseData, *resData)
	}
	results := map[string]interface{}{
		"products":      responseData,
		"total_pages":   totalPages,
		"total_results": totalResults,
		"page":          page,
		"limit":         limit,
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
		VendorID:         row.VendorID.String(),
		CategoryID:       row.CategoryID.String(),
		SubCategoryID:    row.SubCategoryID.UUID.String(),
		ChildCategoryID:  row.ChildCategoryID.UUID.String(),
		ShortDescription: row.ShortDescription.String,
		LongDescription:  row.LongDescription.String,
		ProductType:      row.ProductType.String,
		Status:           string(row.Status.ProductStatus),
		IsApproved:       row.IsApproved.Bool,
		StoreName:        row.StoreName.String,
		CategoryName:     row.CategoryName.String,
		SubCateName:      row.SubCategoryName.String,
		ChildCateName:    row.ChildCategoryName.String,
	}, nil
}

func (ps *ProductService) GetAllProductFlashSale(filter validator.FilterProductRequest) (int, map[string]interface{}) {
	skusRepo := repository.NewSkusRepository()
	reviewsRepo := repository.NewReviewsRepository()
	flashSaleProducts, err := ps.productRepo.GetAllProductsFlashSale(filter.Show)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr), nil
		}
		return response.ErrCodeInternal, nil
	}
	page := 1
	limit := len(flashSaleProducts)
	totalResults := len(flashSaleProducts)
	if filter.Limit != nil {
		limit = *filter.Limit
	}
	if filter.Page != nil {
		page = *filter.Page
	}
	totalPages := internal.CalculateTotalPages(totalResults, limit)
	pagination := internal.Paginate(flashSaleProducts, page, limit)
	var responseData []ProductResponse
	for _, product := range pagination {
		resData, _ := mapProductToResponseData(&product)
		skus, getSkusErr := skusRepo.GetAllSkusByProductId(resData.ID)
		if getSkusErr != nil {
			log.Println(getSkusErr)
			return response.ErrCodeInternal, nil
		}
		reviews, _ := reviewsRepo.GetAllReviewsByProductId(product.ProductID)
		ratingPoint := calculateRatingPoint(reviews)
		resData.RatingPoint = ratingPoint
		if skus != nil && len(skus) > 0 {
			lowestPrice, highestPrice := getLowestHighestPrice(skus)
			resData.LowestPrice = lowestPrice
			resData.HighestPrice = highestPrice
			if filter.LowPrice != nil && filter.HighPrice != nil {
				if resData.LowestPrice <= *filter.LowPrice || resData.HighestPrice >= *filter.HighPrice {
					continue
				}
			}
			responseData = append(responseData, *resData)
		}
	}

	results := map[string]interface{}{
		"products":      responseData,
		"total_pages":   totalPages,
		"total_results": totalResults,
		"page":          page,
		"limit":         limit,
	}
	return response.SuccessCode, results
}

func mapProductToResponseData[T any](data *T) (*ProductResponse, error) {
	switch p := any(data).(type) {
	case *database.Product:
		var images []string
		err := json.Unmarshal(p.Images, &images)
		if err != nil {
			return nil, err
		}
		return &ProductResponse{
			ID:               p.ID,
			Name:             p.Name,
			Slug:             p.Slug,
			Images:           images,
			VendorID:         p.VendorID.String(),
			CategoryID:       p.CategoryID.String(),
			SubCategoryID:    p.SubCategoryID.UUID.String(),
			ChildCategoryID:  p.ChildCategoryID.UUID.String(),
			ShortDescription: p.ShortDescription.String,
			LongDescription:  p.LongDescription.String,
			ProductType:      p.ProductType.String,
			Status:           string(p.Status.ProductStatus),
			IsApproved:       p.IsApproved.Bool,
		}, nil
	case *database.GetFlashSaleProductNowRow:
		var images []string
		err := json.Unmarshal(p.Images, &images)
		if err != nil {
			return nil, err
		}
		return &ProductResponse{
			ID:              p.ProductID,
			Name:            p.Name,
			Slug:            p.Slug,
			Images:          images,
			VendorID:        p.VendorID.String(),
			CategoryID:      p.CategoryID.String(),
			SubCategoryID:   p.SubCategoryID.UUID.String(),
			ChildCategoryID: p.ChildCategoryID.UUID.String(),
			ProductType:     p.ProductType.String,
			Status:          string(p.Status.ProductStatus),
			IsApproved:      false,
			StoreName:       p.StoreName,
			CategoryName:    p.CategoryName,
			SubCateName:     p.SubCategoryName.String,
			ChildCateName:   p.ChildCategoryName.String,
			ShowFlashSale:   &p.Show.Bool,
		}, nil
	case *ProductWithSkus:
		reviewsRepo := repository.NewReviewsRepository()
		product := p.Product
		skus := p.Skus
		reviews := p.Reviews
		var images []string
		err := json.Unmarshal(product.Images, &images)
		if err != nil {
			return nil, err
		}
		var skusRes []map[string]interface{}
		for _, sku := range skus {
			mapData := map[string]interface{}{
				"id":              sku.ID,
				"sku":             sku.Sku,
				"price":           sku.Price,
				"in_stock":        sku.InStock.Int16,
				"variant_options": sku.VariantOptions,
			}
			if time.Now().After(sku.OfferStartDate.Time) && time.Now().Before(sku.OfferEndDate.Time) {
				mapData["offer_price"] = sku.OfferPrice
				mapData["offer"] = sku.Offer.Int32
			}
			skusRes = append(skusRes, mapData)
		}
		var reviewsRes []map[string]interface{}
		var totalRatings float64
		totalRatings = 0
		for _, review := range reviews {
			allRepliesOfReviews, _ := reviewsRepo.GetAllCommentsByReviewId(review.ID)
			var repliesMap []map[string]interface{}
			for _, reply := range allRepliesOfReviews {
				replyMap := map[string]interface{}{
					"id":         reply.ID,
					"user_name":  reply.FullName.String,
					"avt":        reply.Avt.String,
					"comment":    reply.Comment,
					"created_at": reply.CreatedAt.Time.Format("02-01-2006 15:04"),
					"updated_at": reply.UpdatedAt.Time.Format("02-01-2006 15:04"),
				}
				repliesMap = append(repliesMap, replyMap)
			}
			reviewsRes = append(reviewsRes, map[string]interface{}{
				"id":                review.ID,
				"sku_id":            review.SkuID,
				"user_id":           review.UserID,
				"user_name":         review.FullName,
				"avt":               review.Avt,
				"created_at":        review.CreatedAt.Time.Format("02-01-2006 15:04"),
				"updated_at":        review.UpdatedAt.Time.Format("02-01-2006 15:04"),
				"comment":           review.Comment,
				"rating":            review.Rating,
				"replies":           repliesMap,
				"number_of_replies": len(repliesMap),
			})
			totalRatings += review.Rating
		}
		if len(reviews) != 0 {
			totalRatings = totalRatings / float64(len(reviews))
		}
		lowest, highest := getLowestHighestPrice(skus)
		return &ProductResponse{
			ID:               product.ID,
			Name:             product.Name,
			Images:           images,
			LongDescription:  product.LongDescription.String,
			ShortDescription: product.ShortDescription.String,
			CategoryName:     product.CategoryName,
			Variants:         product.Variants,
			Options:          product.Options,
			LowestPrice:      lowest,
			HighestPrice:     highest,
			Vendor: map[string]interface{}{
				"vendorId":     product.VendorID.String(),
				"name":         product.VendorFullName,
				"store_name":   product.StoreName,
				"email":        product.Email,
				"phone_number": product.PhoneNumber,
				"description":  product.VendorDescription.String,
				"address":      product.VendorAddress,
				"banner":       product.VendorBanner,
			},
			Skus:        skusRes,
			Reviews:     reviewsRes,
			RatingPoint: totalRatings,
		}, nil
	default:
		return &ProductResponse{}, nil
	}
}

func calculateRatingPoint(reviews []database.GetAllReviewsByProductIdRow) float64 {
	if len(reviews) == 0 {
		return 0
	}
	var totalPoint float64
	totalPoint = 0
	for _, review := range reviews {
		rating := review.Rating
		totalPoint += rating
	}
	return totalPoint / float64(len(reviews))
}
