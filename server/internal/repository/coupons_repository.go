package repository

import (
	"backend/global"
	"backend/internal/database"
	"backend/internal/validator"
	"encoding/json"
	"github.com/google/uuid"
	"time"
)

type ICouponsRepository interface {
	CreateCondition(field database.ConditionField, operator database.ComparisonOperator, value any) error
	CreateCoupon(id uuid.UUID, customParam validator.CreateCouponValidator, startDate time.Time, endDate time.Time) error
	DeleteCoupon(couponId uuid.UUID) error
}

type CouponRepository struct {
	sqlc *database.Queries
}

func NewCouponRepository() ICouponsRepository {
	return &CouponRepository{sqlc: database.New(global.Mdb)}
}

func (c CouponRepository) CreateCondition(field database.ConditionField, operator database.ComparisonOperator, value any) error {
	var key string
	key = string(field)
	conditionValue := map[string]interface{}{
		key: value,
	}
	conditionJSON, _ := json.Marshal(conditionValue)
	param := database.CreateConditionParams{
		Field:    field,
		Operator: operator,
		Value:    conditionJSON,
	}
	err := c.sqlc.CreateCondition(ctx, param)
	return err
}

func (c CouponRepository) DeleteCoupon(couponId uuid.UUID) error {
	err := c.sqlc.DeleteCoupon(ctx, couponId)
	return err
}

func (c CouponRepository) CreateCoupon(id uuid.UUID, customParam validator.CreateCouponValidator, startDate time.Time, endDate time.Time) error {
	param := database.CreateCouponParams{
		ID:        id,
		Name:      customParam.Name,
		Code:      customParam.Code,
		Quantity:  int32(customParam.Quantity),
		StartDate: startDate,
		EndDate:   endDate,
		Type:      database.DiscountType(customParam.Type),
		Discount:  int32(customParam.Discount),
		MaxPrice:  int32(customParam.MaxPrice),
	}
	err := c.sqlc.CreateCoupon(ctx, param)
	return err
}
