package service

import (
	"github.com/payOSHQ/payos-lib-golang"
	"time"
)

type IPaymentService interface {
	CreatePaymentLink(orderCode int64, amount int64, items []payos.Item) (*payos.CheckoutRequestType, error)
}

type PaymentService struct {
	ClientID    string
	ApiKey      string
	ChecksumKey string
}

func (p PaymentService) CreatePaymentLink(orderCode int64, amount int64, items []payos.Item) (*payos.CheckoutRequestType, error) {
	domain := "http://localhost:3000"
	err := payos.Key(p.ClientID, p.ApiKey, p.ChecksumKey)
	if err != nil {
		return nil, err
	}
	expiredAt := int(time.Now().Add(5 * time.Minute).Unix())
	paymentLinkRequest := payos.CheckoutRequestType{
		OrderCode:   orderCode,
		Amount:      int(amount),
		Description: "Thanh toán đơn hàng",
		CancelUrl:   domain + "/cancel",
		ReturnUrl:   domain + "/succeed",
		Items:       items,
		ExpiredAt:   &expiredAt,
	}
	return &paymentLinkRequest, nil
}

func NewPaymentService() IPaymentService {
	return &PaymentService{
		ClientID:    "047a7f7f-9490-4daa-9ad9-e12bcd51590f",
		ApiKey:      "cd659da7-907d-4d8b-bf45-e428605a330d",
		ChecksumKey: "e35a70cea00d26a8e0005d18a8e62460b04f51f02ca2c1fc265f0c27d6183382",
	}
}
