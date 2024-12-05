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
)

type ResponseDeliveryInfoData struct {
	ID           string `json:"id,omitempty"`
	ReceiverName string `json:"receiver_name,omitempty"`
	PhoneNumber  string `json:"phone_number,omitempty"`
	Email        string `json:"email,omitempty"`
	Address      string `json:"address,omitempty"`
	CreatedAt    string `json:"created_at,omitempty"`
	UpdatedAt    string `json:"updated_at,omitempty"`
}

type IDeliveryInfoService interface {
	CreateDeliveryInfo(userId string, customParam validator.CreateDeliveryInfoValidator) int
	GetAllDeliveryInfoByUserId(userId string) (int, []ResponseDeliveryInfoData)
	GetDeliveryInfoById(id string) (int, *ResponseDeliveryInfoData)
	UpdateDeliveryInfo(id string, customParam validator.UpdateDeliveryInfoValidator) int
	DeleteDeliveryInfoById(id string) int
}

type DeliveryInfoService struct {
	deliveryInfoRepo repository.IDeliveryInfoRepository
}

func (d DeliveryInfoService) CreateDeliveryInfo(userId string, customParam validator.CreateDeliveryInfoValidator) int {
	id, _ := uuid.Parse(userId)
	err := d.deliveryInfoRepo.CreateDeliveryInfo(id, customParam)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr)
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (d DeliveryInfoService) GetAllDeliveryInfoByUserId(userId string) (int, []ResponseDeliveryInfoData) {
	id, _ := uuid.Parse(userId)
	results, err := d.deliveryInfoRepo.GetAllDeliveryInfoByUserId(id)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr), nil
		}
		return response.ErrCodeInternal, nil
	}
	var resData []ResponseDeliveryInfoData
	for _, result := range results {
		resData = append(resData, *mapDeliveryInfoToResponse(&result))
	}
	return response.SuccessCode, resData
}

func (d DeliveryInfoService) GetDeliveryInfoById(id string) (int, *ResponseDeliveryInfoData) {
	deliveryId, _ := uuid.Parse(id)
	result, err := d.deliveryInfoRepo.GetDeliveryInfoById(deliveryId)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr), nil
		}
		return response.ErrCodeNoContent, nil
	}
	resData := mapDeliveryInfoToResponse(result)
	return response.SuccessCode, resData
}

func (d DeliveryInfoService) UpdateDeliveryInfo(id string, customParam validator.UpdateDeliveryInfoValidator) int {
	deliveryId, _ := uuid.Parse(id)
	deliveryInfo, err := d.deliveryInfoRepo.GetDeliveryInfoById(deliveryId)
	if err != nil {
		return response.ErrCodeNoContent
	}
	if customParam.ReceiverName != nil {
		deliveryInfo.ReceiverName = *customParam.ReceiverName
	}
	if customParam.PhoneNumber != nil {
		deliveryInfo.PhoneNumber = *customParam.PhoneNumber
	}
	if customParam.Email != nil {
		deliveryInfo.Email = *customParam.Email
	}
	if customParam.Address != nil {
		deliveryInfo.Address = *customParam.Address
	}
	err = d.deliveryInfoRepo.UpdateDeliveryInfo(*deliveryInfo)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return pg_error.GetMessageError(pqErr)
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (d DeliveryInfoService) DeleteDeliveryInfoById(id string) int {
	deliveryId, _ := uuid.Parse(id)
	err := d.deliveryInfoRepo.DeleteDeliveryInfoById(deliveryId)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			return response.ErrCodeNoContent
		}
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func mapDeliveryInfoToResponse(deliveryInfo *database.DeliveryInfo) *ResponseDeliveryInfoData {
	return &ResponseDeliveryInfoData{
		ID:           deliveryInfo.ID.String(),
		ReceiverName: deliveryInfo.ReceiverName,
		PhoneNumber:  deliveryInfo.PhoneNumber,
		Email:        deliveryInfo.Email,
		Address:      deliveryInfo.Address,
		CreatedAt:    deliveryInfo.CreatedAt.Time.Format("02-01-2006 15:01"),
		UpdatedAt:    deliveryInfo.UpdatedAt.Time.Format("02-01-2006 15:01"),
	}
}

func NewDeliveryInfoService(deliveryInfoRepo repository.IDeliveryInfoRepository) IDeliveryInfoService {
	return &DeliveryInfoService{
		deliveryInfoRepo: deliveryInfoRepo,
	}
}
