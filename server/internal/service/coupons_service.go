package service

import (
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

type ICouponsService interface {
	CreateCondition(customParam validator.CreateConditionValidator) int
	GetAllCondition(filterDescription *string) (int, []database.Condition)
	GetConditionById(id string) (int, *database.Condition)
	UpdateCondition(id string, customParam validator.UpdateConditionValidator) int
	DeleteCondition(id string) int

	CreateCoupon(customParam validator.CreateCouponValidator) int
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

func (c CouponsService) GetAllCondition(filterDescription *string) (int, []database.Condition) {
	results, err := c.couponsRepo.GetAllCondition(filterDescription)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr), nil
		}
		return response.ErrCodeInternal, nil
	}
	return response.SuccessCode, results
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
		mapValue := map[string]interface{}{
			"value": *customParam.Value,
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
	if time.Now().After(startDate) {
		return response.ErrCodeInvalidFlashSaleStartDate
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
