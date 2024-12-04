package repository

import (
	"backend/global"
	"backend/internal/database"
	"backend/internal/validator"
	"database/sql"
	"encoding/json"
	"github.com/google/uuid"
	"log"
	"time"
)

type ICouponsRepository interface {
	CreateCondition(field database.ConditionField, operator database.ComparisonOperator, value any, description string) error
	GetAllCondition(description *string) ([]database.Condition, error)
	DeleteCondition(id uuid.UUID) error

	CreateCoupon(id uuid.UUID, customParam validator.CreateCouponValidator, startDate time.Time, endDate time.Time) error
	DeleteCoupon(couponId uuid.UUID) error
	CreateConditionCoupon(couponId uuid.UUID, conditionId uuid.UUID) error
}

type CouponRepository struct {
	sqlc *database.Queries
}

func NewCouponRepository() ICouponsRepository {
	return &CouponRepository{sqlc: database.New(global.Mdb)}
}

func (c CouponRepository) CreateCondition(field database.ConditionField, operator database.ComparisonOperator, value any, description string) error {
	var key string
	key = string(field)
	conditionValue := map[string]interface{}{
		key: value,
	}
	conditionJSON, _ := json.Marshal(conditionValue)
	param := database.CreateConditionParams{
		Field:       field,
		Operator:    operator,
		Value:       conditionJSON,
		Description: description,
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
		Status: sql.NullBool{
			Bool:  false,
			Valid: true,
		},
	}
	if customParam.Status != nil {
		param.Status = sql.NullBool{
			Bool:  *customParam.Status,
			Valid: true,
		}
	}
	err := c.sqlc.CreateCoupon(ctx, param)
	return err
}

func (c CouponRepository) CreateConditionCoupon(couponId uuid.UUID, conditionId uuid.UUID) error {
	param := database.CreateConditionCouponParams{
		CouponID:    couponId,
		ConditionID: conditionId,
	}
	err := c.sqlc.CreateConditionCoupon(ctx, param)
	return err
}

func (c CouponRepository) DeleteCondition(id uuid.UUID) error {
	err := c.sqlc.DeleteCoupon(ctx, id)
	return err
}

func (c CouponRepository) GetAllCondition(description *string) ([]database.Condition, error) {
	filterDescription := sql.NullString{Valid: false}
	if description != nil && *description != "" {
		filterDescription = sql.NullString{
			Valid:  true,
			String: *description,
		}
	}
	log.Println(filterDescription)
	results, err := c.sqlc.GetAllCondition(ctx, filterDescription)
	if err != nil {
		return nil, err
	}
	return results, nil
}
