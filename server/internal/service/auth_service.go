package service

import (
	"backend/pkg/response"
	"fmt"
	"github.com/golang-jwt/jwt"
	"log"
)

type IAuthService interface {
	ValidateToken(token string, secret string) (int, jwt.MapClaims)
}

type AuthService struct{}

func NewAuthService() IAuthService {
	return &AuthService{}
}

func (as *AuthService) ValidateToken(token string, secret string) (int, jwt.MapClaims) {
	claims := jwt.MapClaims{}
	tkn, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(secret), nil
	})

	if err != nil {
		log.Println("Error parsing token:", err)
		return response.ErrCodeTokenInvalid, nil
	}

	if tkn.Valid {
		return response.SuccessCode, claims
	}
	return response.ErrCodeTokenInvalid, nil
}
