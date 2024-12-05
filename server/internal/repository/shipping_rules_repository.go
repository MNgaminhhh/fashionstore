package repository

import (
	"backend/global"
	"backend/internal/database"
	"backend/internal/validator"
	"database/sql"
	"github.com/google/uuid"
)

type IShippingRulesRepository interface {
	CreateShippingRule(customParam validator.CreateShippingRuleValidator) error
	GetAllShippingRules(filterParam validator.FilterUpdateShippingRuleValidator) ([]database.ShippingRule, error)
	GetShippingRuleById(id uuid.UUID) (*database.ShippingRule, error)
	UpdateShippingRuleById(rule database.ShippingRule) error
	DeleteShippingRuleById(id uuid.UUID) error
}

type ShippingRulesRepository struct {
	sqlc *database.Queries
}

func (s ShippingRulesRepository) CreateShippingRule(customParam validator.CreateShippingRuleValidator) error {
	param := database.CreateShippingRuleParams{
		Name:         customParam.Name,
		MinOrderCost: int64(customParam.MinOrderCost),
		Price:        int32(customParam.Price),
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
	err := s.sqlc.CreateShippingRule(ctx, param)
	return err
}

func (s ShippingRulesRepository) GetAllShippingRules(filterParam validator.FilterUpdateShippingRuleValidator) ([]database.ShippingRule, error) {
	param := database.GetAllShippingRulesParams{
		Column1:      sql.NullString{},
		Status:       sql.NullBool{},
		Price:        -1,
		MinOrderCost: -1,
	}
	if filterParam.Name != nil {
		param.Column1.String = *filterParam.Name
		param.Column1.Valid = true
	}
	if filterParam.Status != nil {
		param.Status = sql.NullBool{
			Bool:  *filterParam.Status,
			Valid: true,
		}
	}
	if filterParam.MinOrderCost != nil {
		param.MinOrderCost = int64(*filterParam.MinOrderCost)
	}
	if filterParam.Price != nil {
		param.Price = int32(*filterParam.Price)
	}
	rules, err := s.sqlc.GetAllShippingRules(ctx, param)
	if err != nil {
		return nil, err
	}
	return rules, nil
}

func (s ShippingRulesRepository) GetShippingRuleById(id uuid.UUID) (*database.ShippingRule, error) {
	rule, err := s.sqlc.GetShippingRuleById(ctx, id)
	if err != nil {
		return nil, err
	}
	return &rule, nil
}

func (s ShippingRulesRepository) UpdateShippingRuleById(rule database.ShippingRule) error {
	param := database.UpdateShippingRuleByIdParams{
		Name:         rule.Name,
		MinOrderCost: rule.MinOrderCost,
		Price:        rule.Price,
		Status:       rule.Status,
		ID:           rule.ID,
	}
	err := s.sqlc.UpdateShippingRuleById(ctx, param)
	return err
}

func (s ShippingRulesRepository) DeleteShippingRuleById(id uuid.UUID) error {
	err := s.sqlc.DeleteShippingRuleById(ctx, id)
	return err
}

func NewShippingRulesRepository() IShippingRulesRepository {
	return &ShippingRulesRepository{
		sqlc: database.New(global.Mdb),
	}
}
