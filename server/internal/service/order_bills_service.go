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
	"fmt"
	"github.com/google/uuid"
	"github.com/lib/pq"
	"github.com/payOSHQ/payos-lib-golang"
	"log"
	"strconv"
	"time"
)

type SkuOrderBillItem struct {
	SkuId        uuid.UUID       `json:"sku_id"`
	VendorId     uuid.UUID       `json:"vendor_id"`
	StoreName    string          `json:"store_name"`
	Banner       string          `json:"banner"`
	ProductName  string          `json:"product_name"`
	ProductImage json.RawMessage `json:"product_image"`
	Quantity     int             `json:"quantity"`
	Price        int             `json:"price"`
	OfferPrice   int             `json:"offer_price"`
	IsPrepared   bool            `json:"is_prepared"`
	UpdatedAt    string          `json:"updated_at"`
}

type ReceiverInfo struct {
	Name        string `json:"receiver_name,omitempty"`
	PhoneNumber string `json:"phone_number,omitempty"`
	Address     string `json:"address,omitempty"`
	Email       string `json:"email,omitempty"`
}

type OrderBillResponse struct {
	ID               string          `json:"id,omitempty"`
	OrderStatus      string          `json:"order_status,omitempty"`
	ProductTotal     int             `json:"product_total,omitempty"`
	ShippingFee      *int            `json:"shipping_fee,omitempty"`
	TotalBill        int             `json:"total_bill,omitempty"`
	DiscountShipping int             `json:"discount_shipping,omitempty"`
	DiscountProduct  int             `json:"discount_product,omitempty"`
	Receiver         *ReceiverInfo   `json:"receiver,omitempty"`
	PayingMethod     string          `json:"paying_method,omitempty"`
	CreatedAt        string          `json:"created_at,omitempty"`
	UpdatedAt        string          `json:"updated_at,omitempty"`
	Skus             json.RawMessage `json:"skus,omitempty"`
	StoreName        string          `json:"store_name,omitempty"`
	Images           json.RawMessage `json:"images,omitempty"`
	ProductName      string          `json:"product_name,omitempty"`
	NumberProduct    int             `json:"number_product,omitempty"`
}

type IOrderBillsService interface {
	CreateBill(userId string, customParam validator.CreateBillValidator) (int, *payos.CheckoutResponseDataType)
	GetAllOrderBillsOfVendor(vendorId string, filterParam validator.FilterUpdateBillValidator) (int, map[string]interface{})
	GetAllOrderBillsOfAdmin(filterParam validator.FilterUpdateBillValidator) (int, map[string]interface{})
	GetOrderBillById(orderId string) (int, map[string]interface{})
	GetAllOrderBillOfUser(userId string, filterParam validator.FilterUpdateBillValidator) (int, map[string]interface{})
	UpdateOrderBillOfVendor(vendorId string, orderId string, isPrepared bool) int
	UpdateOrderBillOfAdmin(orderId string, status string) int
	CallBackFunction(orderCode int64) int
	DeleteOrderBillByOrderCode(orderCode string) int
}

type OrderBillsService struct {
	orderBillRepo repository.IOrderBillsRepository
}

func (o OrderBillsService) GetAllOrderBillOfUser(userId string, filterParam validator.FilterUpdateBillValidator) (int, map[string]interface{}) {
	userUUID, _ := uuid.Parse(userId)
	orderBills, err := o.orderBillRepo.GetAllOrderBillsOfUser(userUUID)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr), nil
		}
		return response.ErrCodeInternal, nil
	}
	limit := len(orderBills)
	page := 1
	totalResults := len(orderBills)
	if filterParam.Limit != nil {
		limit = *filterParam.Limit
	}
	if filterParam.Page != nil {
		page = *filterParam.Page
	}
	totalPages := internal.CalculateTotalPages(totalResults, limit)
	pagination := internal.Paginate(orderBills, page, limit)
	countOrderStatus := map[string]int{
		"paying":    0,
		"pending":   0,
		"shipping":  0,
		"cancel":    0,
		"delivered": 0,
	}
	var resData []OrderBillResponse
	for _, order := range pagination {
		resData = append(resData, *mapOrderBillToResponseData(&order))
		orderStatus := string(order.OrderStatus.OrderStatus)
		countOrderStatus[orderStatus]++
	}
	mapResult := map[string]interface{}{
		"page":            page,
		"limit":           limit,
		"total_results":   totalResults,
		"total_pages":     totalPages,
		"order_bills":     resData,
		"paying_count":    countOrderStatus["paying"],
		"pending_count":   countOrderStatus["pending"],
		"shipping_count":  countOrderStatus["shipping"],
		"cancel_count":    countOrderStatus["cancel"],
		"delivered_count": countOrderStatus["delivered"],
	}
	return response.SuccessCode, mapResult
}

func (o OrderBillsService) DeleteOrderBillByOrderCode(orderCode string) int {
	orderCodeStr := fmt.Sprintf(orderCode)
	err := o.orderBillRepo.DeleteOrderBillByOrderCode(orderCodeStr)
	log.Println(orderCodeStr)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr)
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (o OrderBillsService) GetOrderBillById(orderId string) (int, map[string]interface{}) {
	orderUUID, _ := uuid.Parse(orderId)
	orderBill, err := o.orderBillRepo.GetOrderBillById(orderUUID)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr), nil
		}
		return response.ErrCodeNoContent, nil
	}
	result, code := o.getFullDetailOfOrder(orderBill)
	if code != response.SuccessCode {
		return code, nil
	}
	return response.SuccessCode, result
}

func (o OrderBillsService) getFullDetailOfOrder(bill *database.GetOrderBillByIdRow) (map[string]interface{}, int) {
	skusRepo := repository.NewSkusRepository()
	skus, err := o.orderBillRepo.GetAllSkuOfOrderBill(bill.ID)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return nil, pg_error.GetMessageError(pqErr)
		}
		return nil, response.ErrCodeDatabase
	}
	orderBill := mapOrderBillToResponseData(bill)
	var skusResponse []SkuOrderBillItem
	for _, sku := range skus {
		skuResponse := mapSkuOrderBillToResponseData(&sku)
		productInfo, _ := skusRepo.GetSkuById(sku.SkuID)
		skuResponse.ProductName = productInfo.ProductName
		skuResponse.StoreName = productInfo.StoreName
		skuResponse.Banner = productInfo.Banner
		skuResponse.ProductImage = productInfo.Images
		skusResponse = append(skusResponse, *skuResponse)
	}
	result := map[string]interface{}{
		"orderBill": orderBill,
		"skus":      skusResponse,
	}
	return result, response.SuccessCode
}

func (o OrderBillsService) UpdateOrderBillOfAdmin(orderId string, status string) int {
	orderUUID, _ := uuid.Parse(orderId)
	orderStatus := database.OrderStatus(status)
	order, err := o.orderBillRepo.GetOrderBillById(orderUUID)
	if err != nil {
		return response.ErrCodeNoContent
	}
	if order.OrderStatus.OrderStatus == database.OrderStatusPaying {
		if orderStatus != database.OrderStatusPending {
			return response.ErrCodeInvalidStatus
		}
		if order.PayingMethod.PayingMethod == database.PayingMethodQRCODE {
			return response.ErrCodeUserNotPaying
		}
	} else if order.OrderStatus.OrderStatus == database.OrderStatusShipping {
		if orderStatus != database.OrderStatusDelivered {
			return response.ErrCodeInvalidStatus
		}
	} else {
		return response.ErrCodeInvalidStatus
	}
	err = o.orderBillRepo.UpdateOrderBillStatus(orderUUID, orderStatus)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr)
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (o OrderBillsService) GetAllOrderBillsOfAdmin(filterParam validator.FilterUpdateBillValidator) (int, map[string]interface{}) {
	results, err := o.orderBillRepo.GetAllOrderBillsOfAdmin(filterParam)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr), nil
		}
		return response.ErrCodeNoContent, nil
	}
	limit := len(results)
	page := 1
	totalResults := len(results)
	if filterParam.Limit != nil {
		limit = *filterParam.Limit
	}
	if filterParam.Page != nil {
		page = *filterParam.Page
	}
	totalPages := internal.CalculateTotalPages(totalResults, limit)
	pagination := internal.Paginate(results, page, limit)
	var orderBills []OrderBillResponse
	for _, orderBill := range pagination {
		orderBills = append(orderBills, *mapOrderBillToResponseData(&orderBill))
	}
	resData := map[string]interface{}{
		"order_bills":   orderBills,
		"total_pages":   totalPages,
		"total_results": totalResults,
		"limit":         limit,
		"page":          page,
	}
	return response.SuccessCode, resData
}

func (o OrderBillsService) UpdateOrderBillOfVendor(vendorId string, orderId string, isPrepared bool) int {
	vendorUUID, _ := uuid.Parse(vendorId)
	orderUUID, _ := uuid.Parse(orderId)
	skusOrder, getErr := o.orderBillRepo.GetAllSkuOfOrderBill(orderUUID)
	if getErr != nil {
		log.Println(getErr)
		return response.ErrCodeInternal
	}

	alreadyPrepared := true
	for _, skuOrder := range skusOrder {
		if !skuOrder.IsPrepared.Bool && skuOrder.OrderID != orderUUID {
			alreadyPrepared = false
			break
		}
	}

	err := o.orderBillRepo.UpdateOrderBillOfVendor(vendorUUID, orderUUID, isPrepared)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr)
		}
		return response.ErrCodeInternal
	}
	if alreadyPrepared {
		_ = o.orderBillRepo.UpdateOrderBillStatus(orderUUID, database.OrderStatusShipping)
	}
	return response.SuccessCode
}

func (o OrderBillsService) GetAllOrderBillsOfVendor(vendorId string, filterParam validator.FilterUpdateBillValidator) (int, map[string]interface{}) {
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

func (o OrderBillsService) CreateBill(userId string, customParam validator.CreateBillValidator) (int, *payos.CheckoutResponseDataType) {
	couponRepo := repository.NewCouponRepository()
	userUUID, _ := uuid.Parse(userId)
	deliveryInfoId, _ := uuid.Parse(customParam.DeliveryInfo)
	totalSkuPriceGroupByVendorId, allSkus, isValid := getTotalBill(customParam.Skus)
	var shippingCouponId *uuid.UUID
	var productCouponId *uuid.UUID
	if !isValid {
		return response.ErrCodeInvalidSku, nil
	}
	shippingFee := 0
	totalSkusPrice := 0
	for _, value := range totalSkuPriceGroupByVendorId {
		shippingFeeEachShop, err := getShippingFee(value)
		if err != nil {
			log.Println(err)
			return response.ErrCodeInternal, nil
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
		PayingMethod: database.NullPayingMethod{
			PayingMethod: database.PayingMethod(customParam.PayingMethod),
			Valid:        true,
		},
	}
	if customParam.ShippingCoupon != nil {
		id, _ := uuid.Parse(*customParam.ShippingCoupon)
		shippingCouponId = &id
		shippingCoupon, findErr := couponRepo.GetCouponById(*shippingCouponId)
		if findErr != nil {
			log.Println(findErr)
			return response.ErrCodeNoContent, nil
		}
		if shippingCoupon.Type != database.DiscountTypeShippingPercentage && shippingCoupon.Type != database.DiscountTypeShippingFixed {
			return response.ErrCodeInvalidCouponType, nil
		}
		shippingDiscount, code := getDiscountCoupon(totalSkusPrice, *shippingCoupon, userUUID, shippingFee)
		if code != response.SuccessCode {
			return code, nil
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
			return response.ErrCodeNoContent, nil
		}
		if productCoupon.Type != database.DiscountTypeFixed && productCoupon.Type != database.DiscountTypePercentage {
			return response.ErrCodeInvalidCouponType, nil
		}
		productDiscount, code := getDiscountCoupon(totalSkusPrice, *productCoupon, userUUID, totalSkusPrice)
		if code != response.SuccessCode {
			return code, nil
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
	var payOSItems []payos.Item
	for _, sku := range allSkus {
		payOSItem := payos.Item{
			Name:     sku.ProductName,
			Quantity: sku.Quantity,
			Price:    sku.Price,
		}
		if sku.OfferPrice != 0 {
			payOSItem.Price = sku.OfferPrice
		}
		payOSItems = append(payOSItems, payOSItem)
	}
	shippingFeeItem := payos.Item{
		Name:     "Phí vận chuyển",
		Quantity: 1,
		Price:    int(orderBill.ShippingFee),
	}
	payOSItems = append(payOSItems, shippingFeeItem)
	if orderBill.ShippingDiscount.Valid {
		shippingDiscount := payos.Item{
			Name:     "Giảm giá phí vận chuyển",
			Quantity: 1,
			Price:    int(-orderBill.ShippingDiscount.Int64),
		}
		payOSItems = append(payOSItems, shippingDiscount)
	}
	if orderBill.ProductDiscount.Valid {
		productDiscount := payos.Item{
			Name:     "Giảm giá sản phẩm",
			Quantity: 1,
			Price:    int(-orderBill.ProductDiscount.Int64),
		}
		payOSItems = append(payOSItems, productDiscount)
	}
	orderCode := time.Now().UnixNano() / int64(time.Millisecond)
	var paymentLink *payos.CheckoutResponseDataType
	if orderBill.PayingMethod.PayingMethod == database.PayingMethodQRCODE {
		paymentService := NewPaymentService()
		paymentLinkRequest, err := paymentService.CreatePaymentLink(orderCode, orderBill.TotalBill, payOSItems)
		if err != nil {
			return response.ErrCodeInternal, nil
		}
		paymentLink, err = payos.CreatePaymentLink(*paymentLinkRequest)
		if err != nil {
			log.Println(err)
			return response.ErrCodeInternal, nil
		}
	}
	orderBill.OrderCode = fmt.Sprintf("MTS%d", orderCode)
	createOrderBillErr := o.orderBillRepo.CreateOrderBill(orderBill)
	if createOrderBillErr != nil {
		var pqErr *pq.Error
		if errors.As(createOrderBillErr, &pqErr) {
			return pg_error.GetMessageError(pqErr), nil
		}
		return response.ErrCodeInternal, nil
	}
	cartRepo := repository.NewCartRepository()
	for _, sku := range allSkus {
		_ = cartRepo.DeleteCartItemBySkuIdAndUserId(sku.SkuId, userUUID)
	}
	code := o.createSkuOrderBill(allSkus, orderBill.ID)
	if shippingCouponId != nil {
		err := couponRepo.CreateCouponUser(*shippingCouponId, userUUID, orderBill.ID)
		if err != nil {
			log.Println(err)
			_ = o.orderBillRepo.DeleteOrderBill(orderBill.ID)
			return response.ErrCodeInternal, nil
		}
		_ = couponRepo.UpdateCouponQuantity(*shippingCouponId)
	}
	if productCouponId != nil {
		err := couponRepo.CreateCouponUser(*productCouponId, userUUID, orderBill.ID)
		if err != nil {
			log.Println(err)
			_ = o.orderBillRepo.DeleteOrderBill(orderBill.ID)
			return response.ErrCodeInternal, nil
		}
		_ = couponRepo.UpdateCouponQuantity(*productCouponId)
	}
	if code != response.SuccessCode {
		_ = o.orderBillRepo.DeleteOrderBill(orderBill.ID)
		return code, nil
	}
	return response.SuccessCode, paymentLink
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

		vendorId := skuFindById.VendorID.String()

		skuPrice := getPriceOfSku(*skuFindById)
		totalSkuGroupByVendorId[vendorId] += quantity * skuPrice
		skuOrderBillIem := SkuOrderBillItem{
			SkuId:       skuFindById.ID,
			ProductName: skuFindById.ProductName,
			Quantity:    quantity,
			VendorId:    skuFindById.VendorID,
			Price:       int(skuFindById.Price),
			OfferPrice:  0,
		}
		if skuPrice == int(skuFindById.OfferPrice) {
			skuOrderBillIem.OfferPrice = skuPrice
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

func (o OrderBillsService) CallBackFunction(orderCode int64) int {
	orderCodeStr := fmt.Sprintf("MTS%d", orderCode)
	if orderCodeStr == "MTS123" {
		return response.SuccessCode
	}
	err := o.orderBillRepo.UpdateOrderBillStatusByOrderCode(orderCodeStr, database.OrderStatusPending)
	if err != nil {
		var pqErr *pq.Error
		if !errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr)
		}
		return response.ErrCodeInternal
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

func mapOrderBillToResponseData[T any](data *T) *OrderBillResponse {
	log.Printf("Kiểu của data: %T\n", data)
	switch o := any(data).(type) {
	case *database.OrderBill:
		return &OrderBillResponse{
			ID:           o.ID.String(),
			OrderStatus:  string(o.OrderStatus.OrderStatus),
			TotalBill:    int(o.TotalBill),
			PayingMethod: string(o.PayingMethod.PayingMethod),
			CreatedAt:    o.CreatedAt.Time.Format("02-01-2006 15:04"),
			UpdatedAt:    o.UpdatedAt.Time.Format("02-01-2006 15:04"),
		}
	case *database.GetOrderBillByIdRow:
		receiverInfo := ReceiverInfo{
			Name:        o.ReceiverName,
			PhoneNumber: o.PhoneNumber,
			Address:     o.Address,
			Email:       o.Email,
		}
		shippingFee := int(o.ShippingFee)
		return &OrderBillResponse{
			ID:               o.ID.String(),
			OrderStatus:      string(o.OrderStatus.OrderStatus),
			ProductTotal:     int(o.ProductTotal),
			ShippingFee:      &shippingFee,
			TotalBill:        int(o.TotalBill),
			DiscountShipping: int(o.ShippingDiscount.Int64),
			DiscountProduct:  int(o.ProductDiscount.Int64),
			Receiver:         &receiverInfo,
			PayingMethod:     string(o.PayingMethod.PayingMethod),
			CreatedAt:        o.CreatedAt.Time.Format("02-01-2006 15:04"),
			UpdatedAt:        o.UpdatedAt.Time.Format("02-01-2006 15:04"),
		}
	case *database.GetAllOrderBillsOfUserRow:
		var skus []map[string]interface{}
		err := json.Unmarshal(o.Skus, &skus)
		if err != nil {
			log.Fatalf("Lỗi giải mã JSON: %v", err)
		}
		return &OrderBillResponse{
			ID:            o.ID.String(),
			OrderStatus:   string(o.OrderStatus.OrderStatus),
			TotalBill:     int(o.TotalBill),
			UpdatedAt:     o.UpdatedAt.Time.Format("02-01-2006 15:04"),
			Skus:          o.Skus,
			StoreName:     o.StoreName,
			NumberProduct: len(skus),
		}
	default:
		return &OrderBillResponse{}
	}
}
