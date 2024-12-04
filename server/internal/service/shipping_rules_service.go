package service

import (
	"backend/internal"
	"backend/internal/database"
	"backend/internal/pg_error"
	"backend/internal/repository"
	"backend/internal/validator"
	"backend/pkg/response"
	"database/sql"
	"errors"
	"github.com/google/uuid"
	"github.com/lib/pq"
	"log"
)

type ShippingRuleResponse struct {
	ID           string `json:"id"`
	Name         string `json:"name,omitempty"`
	MinOrderCost int    `json:"min_order_cost,omitempty"`
	Price        int    `json:"price,omitempty"`
	Status       bool   `json:"status"`
	CreatedAt    string `json:"created_at,omitempty"`
	UpdatedAt    string `json:"updated_at,omitempty"`
}

type IShippingRulesService interface {
	CreateShippingRule(customParam validator.CreateShippingRuleValidator) int
	GetAllShippingRules(filterParam validator.FilterUpdateShippingRuleValidator) (int, map[string]interface{})
	GetShippingRuleById(id string) (int, *ShippingRuleResponse)
	UpdateShippingRuleById(id string, customParam validator.FilterUpdateShippingRuleValidator) int
	DeleteShippingRuleById(id string) int
}

type ShippingRulesService struct {
	srRepo repository.IShippingRulesRepository
}

func (s ShippingRulesService) CreateShippingRule(customParam validator.CreateShippingRuleValidator) int {
	price := customParam.Price
	minOrderCost := customParam.MinOrderCost
	if price%100 != 0 || minOrderCost%100 != 0 {
		return response.ErrCodeShippingCost
	}
	err := s.srRepo.CreateShippingRule(customParam)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr)
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (s ShippingRulesService) GetAllShippingRules(filterParam validator.FilterUpdateShippingRuleValidator) (int, map[string]interface{}) {
	rules, err := s.srRepo.GetAllShippingRules(filterParam)
	log.Println(rules)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return response.ErrCodeDatabase, nil
		}
		return response.ErrCodeInternal, nil
	}
	limit := len(rules)
	page := 1
	totalResults := len(rules)
	if filterParam.Page != nil {
		page = *filterParam.Page
	}
	if filterParam.Limit != nil {
		limit = *filterParam.Limit
	}
	totalPages := internal.CalculateTotalPages(totalResults, limit)
	pagination := internal.Paginate(rules, page, limit)
	var results []ShippingRuleResponse
	for _, rule := range pagination {
		results = append(results, *mapShippingRuleToResponse(&rule))
	}
	responseData := map[string]interface{}{
		"totalResults":  totalResults,
		"totalPages":    totalPages,
		"shippingRules": results,
		"page":          page,
		"limit":         limit,
	}
	return response.SuccessCode, responseData
}

func (s ShippingRulesService) GetShippingRuleById(id string) (int, *ShippingRuleResponse) {
	srId, _ := uuid.Parse(id)
	rule, err := s.srRepo.GetShippingRuleById(srId)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr), nil
		}
		return response.ErrCodeNoContent, nil
	}
	return response.SuccessCode, mapShippingRuleToResponse(rule)
}

func (s ShippingRulesService) UpdateShippingRuleById(id string, customParam validator.FilterUpdateShippingRuleValidator) int {
	srId, _ := uuid.Parse(id)
	rule, err := s.srRepo.GetShippingRuleById(srId)
	if err != nil {
		return response.ErrCodeNoContent
	}
	if customParam.Name != nil {
		rule.Name = *customParam.Name
	}
	if customParam.MinOrderCost != nil {
		rule.MinOrderCost = int64(*customParam.MinOrderCost)
	}
	if customParam.Price != nil {
		rule.Price = int32(*customParam.Price)
	}
	if customParam.Status != nil {
		rule.Status = sql.NullBool{
			Bool:  *customParam.Status,
			Valid: true,
		}
	}
	price := rule.Price
	minOrderCost := rule.MinOrderCost
	if price%100 != 0 || minOrderCost%100 != 0 {
		return response.ErrCodeShippingCost
	}
	err = s.srRepo.UpdateShippingRuleById(*rule)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr)
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (s ShippingRulesService) DeleteShippingRuleById(id string) int {
	srId, _ := uuid.Parse(id)
	err := s.srRepo.DeleteShippingRuleById(srId)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr)
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func mapShippingRuleToResponse(rule *database.ShippingRule) *ShippingRuleResponse {
	return &ShippingRuleResponse{
		ID:           rule.ID.String(),
		Name:         rule.Name,
		MinOrderCost: int(rule.MinOrderCost),
		Price:        int(rule.Price),
		Status:       rule.Status.Bool,
		CreatedAt:    rule.CreatedAt.Time.Format("02-01-2006 15:04:05"),
		UpdatedAt:    rule.UpdatedAt.Time.Format("02-01-2006 15:04:05"),
	}
}

func NewShippingRulesService(repo repository.IShippingRulesRepository) IShippingRulesService {
	return &ShippingRulesService{srRepo: repo}
}
