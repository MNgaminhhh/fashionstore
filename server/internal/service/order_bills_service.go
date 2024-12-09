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
	"github.com/google/uuid"
	"github.com/lib/pq"
	"log"
	"strconv"
	"time"
)

type SkuOrderBillItem struct {
	SkuId      uuid.UUID `json:"sku_id"`
	VendorId   uuid.UUID `json:"vendor_id"`
	Quantity   int       `json:"quantity"`
	Price      int       `json:"price"`
	OfferPrice int       `json:"offer_price"`
	IsPrepared bool      `json:"is_prepared"`
	UpdatedAt  string    `json:"updated_at"`
}

type IOrderBillsService interface {
	CreateBill(userId string, customParam validator.CreateBillValidator) int
	GetAllOrderBillsOfVendor(vendorId string, filterParam validator.FilterBillValidator) (int, map[string]interface{})
	UpdateOrderBillOfVendor(vendorId string, orderId string, isPrepared bool) int
}

type OrderBillsService struct {
	orderBillRepo repository.IOrderBillsRepository
}

func (o OrderBillsService) UpdateOrderBillOfVendor(vendorId string, orderId string, isPrepared bool) int {
	//vendorUUID, _ := uuid.Parse(vendorId)
	//orderUUID, _ := uuid.Parse(orderId)
	//skusOrder, getErr := o.orderBillRepo.GetAllSkuOfOrderBill(orderUUID)
	//if getErr != nil {
	//	log.Println(getErr)
	//	return response.ErrCodeInternal
	//}
	//alreadyPrepared := false
	//
	//err := o.orderBillRepo.UpdateOrderBillOfVendor(vendorUUID, orderUUID, isPrepared)
	//if err != nil {
	//	var pqErr *pq.Error
	//	if errors.As(err, &pqErr) {
	//		return pg_error.GetMessageError(pqErr)
	//	}
	//	return response.ErrCodeInternal
	//}

	return response.SuccessCode
}

func (o OrderBillsService) GetAllOrderBillsOfVendor(vendorId string, filterParam validator.FilterBillValidator) (int, map[string]interface{}) {
	vendorUUID, _ := uuid.Parse(vendorId)
	results, err := o.orderBillRepo.GetAllOrderBillsOfVendor(vendorUUID, filterParam)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr), nil
		}
		return response.ErrCodeInternal, nil
	}
	totalResults := len(results)
	page := 1
	limit := totalResults
	if filterParam.Page != nil {
		page = *filterParam.Page
	}
	if filterParam.Limit != nil {
		limit = *filterParam.Limit
	}
	totalPages := internal.CalculateTotalPages(totalResults, limit)
	pagination := internal.Paginate(results, page, limit)
	var orderBillsMap = make(map[string][]SkuOrderBillItem)
	for _, orderBill := range pagination {
		orderId := orderBill.OrderID.String()
		skuOrderItem := mapSkuOrderBillToResponseData(&orderBill)
		orderBillsMap[orderId] = append(orderBillsMap[orderId], *skuOrderItem)
	}
	var resultsMap []map[string]interface{}
	for key, value := range orderBillsMap {
		mapItem := map[string]interface{}{
			"order_id": key,
			"skus":     value,
		}
		resultsMap = append(resultsMap, mapItem)
	}
	resData := map[string]interface{}{
		"totalResults": totalResults,
		"totalPages":   totalPages,
		"page":         page,
		"limit":        limit,
		"order_bills":  resultsMap,
	}
	return response.SuccessCode, resData
}

func (o OrderBillsService) CreateBill(userId string, customParam validator.CreateBillValidator) int {
	couponRepo := repository.NewCouponRepository()
	userUUID, _ := uuid.Parse(userId)
	deliveryInfoId, _ := uuid.Parse(customParam.DeliveryInfo)
	totalSkuPriceGroupByVendorId, allSkus, isValid := getTotalBill(customParam.Skus)
	var shippingCouponId *uuid.UUID
	var productCouponId *uuid.UUID
	if !isValid {
		return response.ErrCodeInvalidSku
	}
	shippingFee := 0
	totalSkusPrice := 0
	for _, value := range totalSkuPriceGroupByVendorId {
		shippingFeeEachShop, err := getShippingFee(value)
		if err != nil {
			log.Println(err)
			return response.ErrCodeInternal
		}
		totalSkusPrice += value
		shippingFee += shippingFeeEachShop
	}

	orderBill := database.OrderBill{
		ID:             uuid.New(),
		UserID:         userUUID,
		DeliveryInfoID: deliveryInfoId,
		ShippingFee:    int64(shippingFee),
		ProductTotal:   int64(totalSkusPrice),
		OrderCode:      strconv.FormatInt(time.Now().UnixNano(), 10),
	}
	if customParam.ShippingCoupon != nil {
		id, _ := uuid.Parse(*customParam.ShippingCoupon)
		shippingCouponId = &id
		shippingCoupon, findErr := couponRepo.GetCouponById(*shippingCouponId)
		if findErr != nil {
			log.Println(findErr)
			return response.ErrCodeNoContent
		}
		if shippingCoupon.Type != database.DiscountTypeShippingPercentage && shippingCoupon.Type != database.DiscountTypeShippingFixed {
			return response.ErrCodeInvalidCouponType
		}
		shippingDiscount, code := getDiscountCoupon(totalSkusPrice, *shippingCoupon, userUUID, shippingFee)
		if code != response.SuccessCode {
			return code
		}
		orderBill.ShippingDiscount = sql.NullInt64{
			Int64: int64(shippingDiscount),
			Valid: true,
		}
	}
	if customParam.ProductCoupon != nil {
		id, _ := uuid.Parse(*customParam.ProductCoupon)
		productCouponId = &id
		productCoupon, findErr := couponRepo.GetCouponById(*productCouponId)
		if findErr != nil {
			log.Println(findErr)
			return response.ErrCodeNoContent
		}
		if productCoupon.Type != database.DiscountTypeFixed && productCoupon.Type != database.DiscountTypePercentage {
			return response.ErrCodeInvalidCouponType
		}
		productDiscount, code := getDiscountCoupon(totalSkusPrice, *productCoupon, userUUID, totalSkusPrice)
		if code != response.SuccessCode {
			return code
		}
		orderBill.ProductDiscount = sql.NullInt64{
			Int64: int64(productDiscount),
			Valid: true,
		}
	}
	totalBill := orderBill.ProductTotal + orderBill.ShippingFee
	if orderBill.ShippingDiscount.Valid {
		totalBill -= orderBill.ShippingDiscount.Int64
	}
	if orderBill.ProductDiscount.Valid {
		totalBill -= orderBill.ProductDiscount.Int64
	}
	orderBill.TotalBill = totalBill
	createOrderBillErr := o.orderBillRepo.CreateOrderBill(orderBill)
	if createOrderBillErr != nil {
		var pqErr *pq.Error
		if errors.As(createOrderBillErr, &pqErr) {
			return pg_error.GetMessageError(pqErr)
		}
		return response.ErrCodeInternal
	}
	code := o.createSkuOrderBill(allSkus, orderBill.ID)
	if shippingCouponId != nil {
		err := couponRepo.CreateCouponUser(*shippingCouponId, userUUID, orderBill.ID)
		if err != nil {
			log.Println(err)
			_ = o.orderBillRepo.DeleteOrderBill(orderBill.ID)
			return response.ErrCodeInternal
		}
		_ = couponRepo.UpdateCouponQuantity(*shippingCouponId)
	}
	if productCouponId != nil {
		err := couponRepo.CreateCouponUser(*productCouponId, userUUID, orderBill.ID)
		if err != nil {
			log.Println(err)
			_ = o.orderBillRepo.DeleteOrderBill(orderBill.ID)
			return response.ErrCodeInternal
		}
		_ = couponRepo.UpdateCouponQuantity(*productCouponId)
	}
	if code != response.SuccessCode {
		_ = o.orderBillRepo.DeleteOrderBill(orderBill.ID)
		return code
	}
	return response.SuccessCode
}

func getDiscountCoupon(totalSkusPrice int, coupon database.GetCouponByIdRow, userId uuid.UUID, cost int) (int, int) {
	couponRepo := repository.NewCouponRepository()
	isUsed, _ := couponRepo.GetCouponUserByCouponIdAndUserId(coupon.ID, userId)
	if isUsed != nil {
		return 0, response.ErrCodeCouponAlreadyUsed
	}
	if int(coupon.TotalUsed.Int32) >= int(coupon.Quantity) {
		return 0, response.ErrCodeInvalidCoupon
	}
	if time.Now().Before(coupon.StartDate) || time.Now().After(coupon.EndDate) {
		return 0, response.ErrCodeInvalidCoupon
	}
	var conditionsMap []map[string]interface{}
	if err := json.Unmarshal(coupon.Conditions, &conditionsMap); err != nil {
		log.Println(err)
		return 0, response.ErrCodeInternal
	}
	for _, condition := range conditionsMap {
		field := condition["field"].(string)
		if field == "price" {
			operator := database.ComparisonOperator(
				condition["operator"].(string))
			valueMap := condition["value"].(map[string]interface{})
			value := valueMap["value"].(float64)
			if operator == database.ComparisonOperatorValue1 {
				if totalSkusPrice < int(value) {
					return 0, response.ErrCodeOrderBillNotEqualMinCost
				}
			}
		}
	}
	if coupon.Type == database.DiscountTypeFixed || coupon.Type == database.DiscountTypeShippingFixed {
		if int(coupon.MaxPrice) > cost {
			return cost, response.SuccessCode
		}
		return int(coupon.MaxPrice), response.SuccessCode
	} else {
		discount := cost * int(coupon.Discount) / 100
		if discount > int(coupon.MaxPrice) {
			return int(coupon.MaxPrice), response.SuccessCode
		}
		return discount, response.SuccessCode
	}
}

func getTotalBill(skus []validator.SkuValidator) (map[string]int, []SkuOrderBillItem, bool) {
	skuRepo := repository.NewSkusRepository()
	var totalSkuGroupByVendorId = make(map[string]int)
	var allSkus []SkuOrderBillItem
	for _, sku := range skus {
		skuId, _ := uuid.Parse(sku.SkuId)
		skuFindById, err := skuRepo.GetSkuById(skuId)
		if err != nil {
			log.Println(err)
			return nil, nil, false
		}
		quantity := sku.Quantity
		if quantity > int(skuFindById.InStock.Int16) {
			return nil, nil, false
		}
		if skuFindById.Status != database.SkuStatusActive {
			return nil, nil, false
		}

		vendorId := skuFindById.VendorID.UUID.String()

		skuPrice := getPriceOfSku(*skuFindById)
		totalSkuGroupByVendorId[vendorId] += quantity * skuPrice
		skuOrderBillIem := SkuOrderBillItem{
			SkuId:      skuFindById.ID,
			Quantity:   quantity,
			VendorId:   skuFindById.VendorID.UUID,
			Price:      int(skuFindById.Price),
			OfferPrice: int(skuFindById.OfferPrice),
		}
		allSkus = append(allSkus, skuOrderBillIem)
	}
	return totalSkuGroupByVendorId, allSkus, true
}

func getPriceOfSku(sku database.GetSkuByIdRow) int {
	if sku.Offer.Int32 == 0 {
		return int(sku.Price)
	}
	if time.Now().Before(sku.OfferStartDate.Time) || time.Now().After(sku.OfferEndDate.Time) {
		return int(sku.Price)
	}
	return int(sku.OfferPrice)
}

func getShippingFee(totalSkusPrice int) (int, error) {
	shippingRulesRepo := repository.NewShippingRulesRepository()
	var status bool
	status = true
	filterParam := validator.FilterUpdateShippingRuleValidator{
		Status: &status,
	}
	shippingRules, err := shippingRulesRepo.GetAllShippingRules(filterParam)
	if err != nil {
		return 0, err
	}
	for _, rule := range shippingRules {
		if totalSkusPrice >= int(rule.MinOrderCost) {
			return int(rule.Price), nil
		}
	}
	return int(shippingRules[len(shippingRules)-1].Price), nil
}

func (o OrderBillsService) createSkuOrderBill(skus []SkuOrderBillItem, orderBillId uuid.UUID) int {
	for _, sku := range skus {
		skuOrderBill := database.SkusOrderBill{
			SkuID:      sku.SkuId,
			Quantity:   int32(sku.Quantity),
			OrderID:    orderBillId,
			VendorID:   sku.VendorId,
			Price:      int64(sku.Price),
			OfferPrice: int64(sku.OfferPrice),
		}
		err := o.orderBillRepo.CreateSkuOrderBill(skuOrderBill)
		if err != nil {
			var pqErr *pq.Error
			if !errors.As(err, &pqErr) {
				return pg_error.GetMessageError(pqErr)
			}
			return response.ErrCodeInternal
		}
	}
	return response.SuccessCode
}

func NewOrderBillsService(orderBillRepo repository.IOrderBillsRepository) IOrderBillsService {
	return &OrderBillsService{orderBillRepo: orderBillRepo}
}

func mapSkuOrderBillToResponseData(data *database.SkusOrderBill) *SkuOrderBillItem {
	return &SkuOrderBillItem{
		SkuId:      data.SkuID,
		VendorId:   data.VendorID,
		Quantity:   int(data.Quantity),
		Price:      int(data.Price),
		OfferPrice: int(data.OfferPrice),
		IsPrepared: data.IsPrepared.Bool,
		UpdatedAt:  data.UpdatedAt.Time.Format("02-01-2006 15:04"),
	}
}
