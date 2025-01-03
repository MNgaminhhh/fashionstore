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
	GetConditionById(id uuid.UUID) (*database.Condition, error)
	UpdateCondition(condition database.Condition) error
	DeleteCondition(id uuid.UUID) error

	CreateCoupon(id uuid.UUID, customParam validator.CreateCouponValidator, startDate time.Time, endDate time.Time) error
	GetCouponById(id uuid.UUID) (*database.GetCouponByIdRow, error)
	GetAllCoupon(filterParam validator.FilterCouponsValidator) ([]database.GetAllCouponRow, error)
	GetAllCouponsCanUse() ([]database.GetAllCouponCanUseRow, error)
	UpdateCouponById(coupon database.GetCouponByIdRow) error
	UpdateCouponStatus(id uuid.UUID, status bool) error
	UpdateCouponQuantity(id uuid.UUID) error
	DeleteCoupon(couponId uuid.UUID) error

	CreateConditionCoupon(couponId uuid.UUID, conditionId uuid.UUID) error
	DeleteConditionCouponByCouponId(couponId uuid.UUID) error

	CreateCouponUser(couponId uuid.UUID, userId uuid.UUID, orderId uuid.UUID) error
	GetCouponUserByCouponIdAndUserId(couponId uuid.UUID, userId uuid.UUID) (*database.CouponsUser, error)
}

type CouponRepository struct {
	sqlc *database.Queries
}

func NewCouponRepository() ICouponsRepository {
	return &CouponRepository{sqlc: database.New(global.Mdb)}
}

func (c CouponRepository) CreateCondition(field database.ConditionField, operator database.ComparisonOperator, value any, description string) error {
	conditionValue := map[string]interface{}{
		"value": value,
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

func (c CouponRepository) GetConditionById(id uuid.UUID) (*database.Condition, error) {
	condition, err := c.sqlc.GetConditionById(ctx, id)
	if err != nil {
		return nil, err
	}
	return &condition, nil
}

func (c CouponRepository) UpdateCondition(condition database.Condition) error {
	param := database.UpdateConditionParams{
		ID:          condition.ID,
		Field:       condition.Field,
		Operator:    condition.Operator,
		Value:       condition.Value,
		Description: condition.Description,
	}
	err := c.sqlc.UpdateCondition(ctx, param)
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

func (c CouponRepository) GetAllCoupon(filterParam validator.FilterCouponsValidator) ([]database.GetAllCouponRow, error) {
	param := database.GetAllCouponParams{
		Column1:   sql.NullString{},
		Column2:   "",
		Quantity:  -1,
		TotalUsed: sql.NullInt32{},
		Discount:  -1,
		MaxPrice:  -1,
		Status:    sql.NullBool{},
	}
	if filterParam.Name != nil {
		param.Column1 = sql.NullString{
			String: *filterParam.Name,
			Valid:  true,
		}
	}
	if filterParam.Type != nil {
		param.Column2 = *filterParam.Type
	}
	if filterParam.Quantity != nil {
		param.Quantity = int32(*filterParam.Quantity)
	}
	if filterParam.TotalUsed != nil {
		param.TotalUsed = sql.NullInt32{
			Int32: int32(*filterParam.TotalUsed),
			Valid: true,
		}
	}
	if filterParam.Discount != nil {
		param.Discount = int32(*filterParam.Discount)
	}
	if filterParam.MaxPrice != nil {
		param.MaxPrice = int32(*filterParam.MaxPrice)
	}
	if filterParam.Status != nil {
		param.Status = sql.NullBool{
			Bool:  *filterParam.Status,
			Valid: true,
		}
	}
	results, err := c.sqlc.GetAllCoupon(ctx, param)
	if err != nil {
		return nil, err
	}
	return results, nil
}

func (c CouponRepository) GetAllCouponsCanUse() ([]database.GetAllCouponCanUseRow, error) {
	results, err := c.sqlc.GetAllCouponCanUse(ctx)
	if err != nil {
		return nil, err
	}
	return results, nil
}

func (c CouponRepository) GetCouponById(id uuid.UUID) (*database.GetCouponByIdRow, error) {
	coupon, err := c.sqlc.GetCouponById(ctx, id)
	if err != nil {
		return nil, err
	}
	return &coupon, nil
}

func (c CouponRepository) UpdateCouponById(coupon database.GetCouponByIdRow) error {
	param := database.UpdateCouponByCouponIdParams{
		Name:      coupon.Name,
		Code:      coupon.Code,
		Quantity:  coupon.Quantity,
		StartDate: coupon.StartDate,
		EndDate:   coupon.EndDate,
		Type:      coupon.Type,
		Discount:  coupon.Discount,
		MaxPrice:  coupon.MaxPrice,
		Status:    coupon.Status,
		ID:        coupon.ID,
	}
	err := c.sqlc.UpdateCouponByCouponId(ctx, param)
	return err
}

func (c CouponRepository) UpdateCouponStatus(id uuid.UUID, status bool) error {
	param := database.UpdateCouponStatusParams{
		ID: id,
		Status: sql.NullBool{
			Bool:  status,
			Valid: true,
		},
	}
	err := c.sqlc.UpdateCouponStatus(ctx, param)
	return err
}

func (c CouponRepository) UpdateCouponQuantity(id uuid.UUID) error {
	err := c.sqlc.UpdateCouponTotalUsed(ctx, id)
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

func (c CouponRepository) DeleteConditionCouponByCouponId(couponId uuid.UUID) error {
	err := c.sqlc.DeleteConditionCouponByCouponId(ctx, couponId)
	return err
}

func (c CouponRepository) DeleteCondition(id uuid.UUID) error {
	err := c.sqlc.DeleteCondition(ctx, id)
	return err
}

func (c CouponRepository) CreateCouponUser(couponId uuid.UUID, userId uuid.UUID, orderId uuid.UUID) error {
	param := database.CreateCouponUserParams{
		CouponID: couponId,
		UserID:   userId,
		OrderID: uuid.NullUUID{
			UUID:  orderId,
			Valid: true,
		},
	}
	err := c.sqlc.CreateCouponUser(ctx, param)
	return err
}

func (c CouponRepository) GetCouponUserByCouponIdAndUserId(couponId uuid.UUID, userId uuid.UUID) (*database.CouponsUser, error) {
	param := database.GetCouponUserByCouponIdAndUserIdParams{
		CouponID: couponId,
		UserID:   userId,
	}
	result, err := c.sqlc.GetCouponUserByCouponIdAndUserId(ctx, param)
	if err != nil {
		return nil, err
	}
	return &result, err
}
