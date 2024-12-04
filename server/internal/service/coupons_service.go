package service

import (
	"backend/internal/database"
	"backend/internal/pg_error"
	"backend/internal/repository"
	"backend/internal/validator"
	"backend/pkg/response"
	"errors"
	"github.com/google/uuid"
	"github.com/lib/pq"
	"strconv"
	"time"
)

type ICouponsService interface {
	CreateCondition(customParam validator.CreateConditionValidator) int
	GetAllCondition(filterDescription *string) (int, []database.Condition)

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
