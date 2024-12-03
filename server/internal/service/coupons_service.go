package service

import (
	"backend/internal/database"
	"backend/internal/pg_error"
	"backend/internal/repository"
	"backend/internal/validator"
	"backend/pkg/response"
	"errors"
	"github.com/lib/pq"
	"strconv"
)

type ICouponsService interface {
	CreateCondition(customParam validator.CreateConditionValidator) int
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
	err := c.couponsRepo.CreateCondition(field, operator, value)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr)
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}
