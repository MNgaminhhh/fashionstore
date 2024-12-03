package repository

import (
	"backend/global"
	"backend/internal/database"
	"encoding/json"
)

type ICouponsRepository interface {
	CreateCondition(field database.ConditionField, operator database.ComparisonOperator, value any) error
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
