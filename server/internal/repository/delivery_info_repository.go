package repository

import (
	"backend/global"
	"backend/internal/database"
	"backend/internal/validator"
	"github.com/google/uuid"
)

type IDeliveryInfoRepository interface {
	CreateDeliveryInfo(userId uuid.UUID, customParam validator.CreateDeliveryInfoValidator) error
	GetAllDeliveryInfoByUserId(userId uuid.UUID) ([]database.DeliveryInfo, error)
	GetDeliveryInfoById(id uuid.UUID) (*database.DeliveryInfo, error)
	UpdateDeliveryInfo(deliveryInfo database.DeliveryInfo) error
	DeleteDeliveryInfoById(id uuid.UUID) error
}

type DeliveryInfoRepository struct {
	sqlc *database.Queries
}

func (d DeliveryInfoRepository) CreateDeliveryInfo(userId uuid.UUID, customParam validator.CreateDeliveryInfoValidator) error {
	param := database.CreateDeliveryInfoParams{
		UserID:       userId,
		ReceiverName: customParam.ReceiverName,
		Address:      customParam.Address,
		PhoneNumber:  customParam.PhoneNumber,
		Email:        customParam.Email,
	}
	err := d.sqlc.CreateDeliveryInfo(ctx, param)
	return err
}

func (d DeliveryInfoRepository) GetAllDeliveryInfoByUserId(userId uuid.UUID) ([]database.DeliveryInfo, error) {
	results, err := d.sqlc.GetAllDeliveryInfoByUserId(ctx, userId)
	if err != nil {
		return nil, err
	}
	return results, nil
}

func (d DeliveryInfoRepository) GetDeliveryInfoById(id uuid.UUID) (*database.DeliveryInfo, error) {
	deliveryInfo, err := d.sqlc.GetDeliveryInfoById(ctx, id)
	if err != nil {
		return nil, err
	}
	return &deliveryInfo, nil
}

func (d DeliveryInfoRepository) UpdateDeliveryInfo(deliveryInfo database.DeliveryInfo) error {
	param := database.UpdateDeliveryInfoByIdParams{
		ID:           deliveryInfo.ID,
		ReceiverName: deliveryInfo.ReceiverName,
		Address:      deliveryInfo.Address,
		PhoneNumber:  deliveryInfo.PhoneNumber,
		Email:        deliveryInfo.Email,
	}
	err := d.sqlc.UpdateDeliveryInfoById(ctx, param)
	return err
}

func (d DeliveryInfoRepository) DeleteDeliveryInfoById(id uuid.UUID) error {
	err := d.sqlc.DeleteDeliveryInfo(ctx, id)
	return err
}

func NewDeliveryInfoRepository() IDeliveryInfoRepository {
	return &DeliveryInfoRepository{
		sqlc: database.New(global.Mdb),
	}
}
