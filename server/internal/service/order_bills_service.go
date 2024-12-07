package service

import (
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
	SkuId      uuid.UUID
	Quantity   int
	Price      int
	OfferPrice int
}

type IOrderBillsService interface {
	CreateBill(userId string, customParam validator.CreateBillValidator) int
}

type OrderBillsService struct {
	orderBillRepo repository.IOrderBillsRepository
}

func (o OrderBillsService) CreateBill(userId string, customParam validator.CreateBillValidator) int {
	couponRepo := repository.NewCouponRepository()
	userUUID, _ := uuid.Parse(userId)
	deliveryInfoId, _ := uuid.Parse(customParam.DeliveryInfo)
	totalSkusPrice, allSkus, isValid := getTotalBill(customParam.Skus)
	var shippingCouponId *uuid.UUID
	var productCouponId *uuid.UUID
	if !isValid {
		return response.ErrCodeInvalidSku
	}
	shippingFee, err := getShippingFee(*totalSkusPrice)
	if err != nil {
		log.Println(err)
		return response.ErrCodeInternal
	}
	orderBill := database.OrderBill{
		ID:             uuid.New(),
		UserID:         userUUID,
		DeliveryInfoID: deliveryInfoId,
		ShippingFee:    int64(shippingFee),
		ProductTotal:   int64(*totalSkusPrice),
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
		shippingDiscount, code := getDiscountCoupon(*totalSkusPrice, *shippingCoupon, userUUID, shippingFee)
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
		productDiscount, code := getDiscountCoupon(*totalSkusPrice, *productCoupon, userUUID, *totalSkusPrice)
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
		err = couponRepo.CreateCouponUser(*shippingCouponId, userUUID, orderBill.ID)
		if err != nil {
			log.Println(err)
			_ = o.orderBillRepo.DeleteOrderBill(orderBill.ID)
			return response.ErrCodeInternal
		}
		_ = couponRepo.UpdateCouponQuantity(*shippingCouponId)
	}
	if productCouponId != nil {
		err = couponRepo.CreateCouponUser(*productCouponId, userUUID, orderBill.ID)
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

func getTotalBill(skus []validator.SkuValidator) (*int, []SkuOrderBillItem, bool) {
	skuRepo := repository.NewSkusRepository()
	totalBill := 0
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
		skuPrice := getPriceOfSku(*skuFindById)
		totalBill += skuPrice * quantity
		skuOrderBillIem := SkuOrderBillItem{
			SkuId:      skuFindById.ID,
			Quantity:   quantity,
			Price:      int(skuFindById.Price),
			OfferPrice: int(skuFindById.OfferPrice),
		}
		allSkus = append(allSkus, skuOrderBillIem)
	}
	return &totalBill, allSkus, true
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
