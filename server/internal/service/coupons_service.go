package service

import (
	"backend/internal"
	"backend/internal/database"
	"backend/internal/pg_error"
	"backend/internal/repository"
	"backend/internal/validator"
	"backend/pkg/response"
	"encoding/json"
	"errors"
	"github.com/google/uuid"
	"github.com/lib/pq"
	"log"
	"strconv"
	"time"
)

type CouponResponseData struct {
	ID        string          `json:"id"`
	Name      string          `json:"name,omitempty"`
	Code      string          `json:"code,omitempty"`
	Quantity  int             `json:"quantity,omitempty"`
	StartDate string          `json:"startDate,omitempty"`
	EndDate   string          `json:"endDate,omitempty"`
	Type      string          `json:"type,omitempty"`
	Discount  interface{}     `json:"discount,omitempty"`
	TotalUsed int             `json:"totalUsed"`
	Status    bool            `json:"status"`
	Condition json.RawMessage `json:"condition,omitempty"`
	MaxPrice  int             `json:"max_price"`
}

type ICouponsService interface {
	CreateCondition(customParam validator.CreateConditionValidator) int
	GetAllCondition(filterParam validator.FilterConditionValidator) (int, map[string]interface{})
	GetConditionById(id string) (int, *database.Condition)
	UpdateCondition(id string, customParam validator.UpdateConditionValidator) int
	DeleteCondition(id string) int

	CreateCoupon(customParam validator.CreateCouponValidator) int
	GetAllCoupon(filterParam validator.FilterCouponsValidator) (int, map[string]interface{})
	GetAllCouponCanUseOfUser(userId string) (int, []CouponResponseData)
	GetCouponById(id string) (int, *CouponResponseData)
	UpdateCouponStatus(id string, status bool) int
	UpdateCouponById(id string, couponValidator validator.CreateCouponValidator) int
}

type CouponsService struct {
	couponsRepo repository.ICouponsRepository
}

func NewCouponsService(couponsRepo repository.ICouponsRepository) ICouponsService {
	return &CouponsService{couponsRepo: couponsRepo}
}

func (c CouponsService) CreateCondition(customParam validator.CreateConditionValidator) int {
	field := database.ConditionField(customParam.Field)
	operator := database.ComparisonOperator(customParam.Operator)
	description := customParam.Description
	var value any
	if field == database.ConditionFieldPrice || field == database.ConditionFieldShippingCost {
		var errParseInt error
		value, errParseInt = strconv.ParseInt(customParam.Value, 10, 64)
		if errParseInt != nil {
			return response.ErrCodeInternal
		}
	} else {
		value = customParam.Value
	}
	err := c.couponsRepo.CreateCondition(field, operator, value, description)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr)
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (c CouponsService) GetAllCondition(filterParam validator.FilterConditionValidator) (int, map[string]interface{}) {
	results, err := c.couponsRepo.GetAllCondition(filterParam.Description)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr), nil
		}
		return response.ErrCodeInternal, nil
	}
	totalResults := len(results)
	limit := totalResults
	page := 1
	if filterParam.Limit != nil {
		limit = *filterParam.Limit
	}
	if filterParam.Page != nil {
		page = *filterParam.Page
	}
	pagination := internal.Paginate(results, page, limit)
	totalPages := internal.CalculateTotalPages(totalResults, limit)
	resData := map[string]interface{}{
		"totalResults": totalResults,
		"totalPages":   totalPages,
		"page":         page,
		"limit":        limit,
		"conditions":   pagination,
	}
	return response.SuccessCode, resData
}

func (c CouponsService) GetAllCouponCanUseOfUser(userId string) (int, []CouponResponseData) {
	userUUID, _ := uuid.Parse(userId)
	allCoupons, err := c.couponsRepo.GetAllCouponsCanUse()
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr), nil
		}
		return response.ErrCodeInternal, nil
	}
	var couponsCanUse []CouponResponseData
	for _, coupon := range allCoupons {
		isUsed, _ := c.couponsRepo.GetCouponUserByCouponIdAndUserId(coupon.ID, userUUID)
		if isUsed == nil {
			couponsCanUse = append(couponsCanUse, *mapCouponToResponseData(&coupon))
		}
	}
	return response.SuccessCode, couponsCanUse
}

func (c CouponsService) GetConditionById(id string) (int, *database.Condition) {
	conditionId, _ := uuid.Parse(id)
	result, err := c.couponsRepo.GetConditionById(conditionId)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr), nil
		}
		return response.ErrCodeInternal, nil
	}
	return response.SuccessCode, result
}

func (c CouponsService) UpdateCondition(id string, customParam validator.UpdateConditionValidator) int {
	conditionId, _ := uuid.Parse(id)
	condition, findByIdErr := c.couponsRepo.GetConditionById(conditionId)
	if findByIdErr != nil {
		return response.ErrCodeNoContent
	}
	if customParam.Field != nil {
		condition.Field = database.ConditionField(*customParam.Field)
	}
	if customParam.Description != nil {
		condition.Description = *customParam.Description
	}
	if customParam.Value != nil {
		var mapValue map[string]interface{}
		if condition.Field == database.ConditionFieldPrice || condition.Field == database.ConditionFieldShippingCost {
			value, errParseInt := strconv.ParseInt(*customParam.Value, 10, 64)
			if errParseInt != nil {
				return response.ErrCodeInternal
			}
			mapValue = map[string]interface{}{
				"value": value,
			}
		} else {
			mapValue = map[string]interface{}{
				"value": *customParam.Value,
			}
		}
		value, _ := json.Marshal(mapValue)
		condition.Value = value
	}
	log.Println(condition)
	err := c.couponsRepo.UpdateCondition(*condition)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr)
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (c CouponsService) DeleteCondition(id string) int {
	conditionId, _ := uuid.Parse(id)
	err := c.couponsRepo.DeleteCondition(conditionId)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			if pqErr.Code == "23503" {
				if pqErr.Constraint == "conditions_coupons_condition_id_fkey" {
					return response.ErrCodeConstraintDeleteCondition
				}
			}
			return pg_error.GetMessageError(pqErr)
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (c CouponsService) CreateCoupon(customParam validator.CreateCouponValidator) int {
	newId := uuid.New()
	startDate, parseErr := time.Parse("02-01-2006", customParam.StartDate)
	if parseErr != nil {
		return response.ErrCodeIncorrectDateFormat
	}
	endDate, parseErr := time.Parse("02-01-2006", customParam.EndDate)
	if parseErr != nil {
		return response.ErrCodeIncorrectDateFormat
	}
	couponType := database.DiscountType(customParam.Type)
	if couponType == database.DiscountTypeFixed || couponType == database.DiscountTypeShippingFixed {
		if customParam.MaxPrice != customParam.Discount {
			return response.ErrCodeDiscountFixedType
		}
	} else {
		if customParam.Discount < 0 || customParam.Discount > 100 {
			return response.ErrCodeValueDiscountPercentage
		}
	}
	err := c.couponsRepo.CreateCoupon(newId, customParam, startDate, endDate)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr)
		}
		return response.ErrCodeInternal
	}
	for _, condition := range customParam.Conditions {
		conditionId := condition.ConditionId
		addConditionErr := c.couponsRepo.CreateConditionCoupon(newId, conditionId)
		if addConditionErr != nil {
			_ = c.couponsRepo.DeleteCoupon(conditionId)
			var pqErr *pq.Error
			if errors.As(addConditionErr, &pqErr) {
				return pg_error.GetMessageError(pqErr)
			}
		}
	}
	return response.SuccessCode
}

func (c CouponsService) GetAllCoupon(filterParam validator.FilterCouponsValidator) (int, map[string]interface{}) {
	results, err := c.couponsRepo.GetAllCoupon(filterParam)
	if err != nil {
		log.Println(err)
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr), nil
		}
		return response.ErrCodeInternal, nil
	}
	totalResults := len(results)
	page := 1
	limit := totalResults
	if filterParam.Limit != nil {
		limit = *filterParam.Limit
	}
	if filterParam.Page != nil {
		page = *filterParam.Page
	}
	totalPages := internal.CalculateTotalPages(totalResults, limit)
	pagination := internal.Paginate(results, page, limit)
	var coupons []CouponResponseData
	for _, coupon := range pagination {
		coupons = append(coupons, *mapCouponToResponseData(&coupon))
	}
	resData := map[string]interface{}{
		"totalResults": totalResults,
		"totalPages":   totalPages,
		"limit":        limit,
		"page":         page,
		"coupons":      coupons,
	}
	return response.SuccessCode, resData
}

func (c CouponsService) GetCouponById(id string) (int, *CouponResponseData) {
	couponId, _ := uuid.Parse(id)
	result, err := c.couponsRepo.GetCouponById(couponId)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return response.ErrCodeNoContent, nil
		}
		return response.ErrCodeInternal, nil
	}
	return response.SuccessCode, mapCouponToResponseData(result)
}

func (c CouponsService) UpdateCouponStatus(id string, status bool) int {
	couponId, _ := uuid.Parse(id)
	if status == false {
		coupon, err := c.couponsRepo.GetCouponById(couponId)
		if err != nil {
			return response.ErrCodeNoContent
		}
		if coupon.Status.Bool != status && time.Now().After(coupon.StartDate) {
			return response.ErrCodeInactiveCouponAfterStartDate
		}
	}
	err := c.couponsRepo.UpdateCouponStatus(couponId, status)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr)
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (c CouponsService) UpdateCouponById(id string, couponValidator validator.CreateCouponValidator) int {
	couponId, _ := uuid.Parse(id)
	coupon, findErr := c.couponsRepo.GetCouponById(couponId)
	if findErr != nil {
		return response.ErrCodeNoContent
	}
	if coupon.Status.Bool == true && time.Now().After(coupon.StartDate) {
		return response.ErrCodeCouponsAreUsing
	}
	coupon.Name = couponValidator.Name
	coupon.Type = database.DiscountType(couponValidator.Type)
	coupon.Code = couponValidator.Code
	startDate, parseErr := time.Parse("02-01-2006", couponValidator.StartDate)
	if parseErr != nil {
		return response.ErrCodeIncorrectDateFormat
	}
	endDate, parseErr := time.Parse("02-01-2006", couponValidator.EndDate)
	if parseErr != nil {
		return response.ErrCodeIncorrectDateFormat
	}
	if endDate.Before(startDate) {
		return response.ErrCodeInvalidEndDate
	}
	coupon.StartDate = startDate
	coupon.EndDate = endDate
	coupon.Discount = int32(couponValidator.Discount)
	coupon.Quantity = int32(couponValidator.Quantity)
	coupon.MaxPrice = int32(couponValidator.MaxPrice)
	if coupon.Type == database.DiscountTypeFixed {
		if couponValidator.MaxPrice != couponValidator.Discount {
			return response.ErrCodeDiscountFixedType
		}
	} else {
		if couponValidator.Discount < 0 || couponValidator.Discount > 100 {
			return response.ErrCodeValueDiscountPercentage
		}
	}
	deleteOldConditionErr := c.couponsRepo.DeleteConditionCouponByCouponId(couponId)
	if deleteOldConditionErr != nil {
		return response.ErrCodeInternal
	}
	for _, condition := range couponValidator.Conditions {
		conditionId := condition.ConditionId
		addConditionErr := c.couponsRepo.CreateConditionCoupon(couponId, conditionId)
		if addConditionErr != nil {
			var pqErr *pq.Error
			if errors.As(addConditionErr, &pqErr) {
				return pg_error.GetMessageError(pqErr)
			}
			return response.ErrCodeInternal
		}
	}
	updateErr := c.couponsRepo.UpdateCouponById(*coupon)
	if updateErr != nil {
		var pqErr *pq.Error
		if errors.As(updateErr, &pqErr) {
			return pg_error.GetMessageError(pqErr)
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func mapCouponToResponseData[T any](data *T) *CouponResponseData {
	switch c := any(data).(type) {
	case *database.GetCouponByIdRow:
		return &CouponResponseData{
			ID:        c.ID.String(),
			Name:      c.Name,
			Code:      c.Code,
			Quantity:  int(c.Quantity),
			StartDate: c.StartDate.Format("02-01-2006"),
			EndDate:   c.EndDate.Format("02-01-2006"),
			Type:      string(c.Type),
			Discount:  c.Discount,
			TotalUsed: int(c.TotalUsed.Int32),
			Status:    c.Status.Bool,
			Condition: c.Conditions,
			MaxPrice:  int(c.MaxPrice),
		}
	case *database.GetAllCouponRow:
		return &CouponResponseData{
			ID:        c.ID.String(),
			Name:      c.Name,
			Code:      c.Code,
			Quantity:  int(c.Quantity),
			StartDate: c.StartDate.Format("02-01-2006"),
			EndDate:   c.EndDate.Format("02-01-2006"),
			Type:      string(c.Type),
			Discount:  c.Discount,
			TotalUsed: int(c.TotalUsed.Int32),
			Status:    c.Status.Bool,
			Condition: c.Conditions,
			MaxPrice:  int(c.MaxPrice),
		}
	case *database.GetAllCouponCanUseRow:
		return &CouponResponseData{
			ID:        c.ID.String(),
			Name:      c.Name,
			Code:      c.Code,
			Quantity:  int(c.Quantity),
			StartDate: c.StartDate.Format("02-01-2006"),
			EndDate:   c.EndDate.Format("02-01-2006"),
			Type:      string(c.Type),
			Discount:  c.Discount,
			TotalUsed: int(c.TotalUsed.Int32),
			Status:    c.Status.Bool,
			Condition: c.Conditions,
			MaxPrice:  int(c.MaxPrice),
		}
	default:
		return &CouponResponseData{}
	}
}
