package service

import (
	"backend/internal/database"
	"backend/internal/repository"
	"github.com/golang-jwt/jwt"
	"net/http"
	"time"
)

type Auth struct {
	Issuer       string
	Audience     string
	Secret       string
	TokenExpiry  time.Duration
	CookieDomain string
	CookiePath   string
	CookieName   string
}

func (j *Auth) GenerateToken(user *database.User) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)
	claims["iss"] = j.Issuer
	claims["exp"] = time.Now().Add(j.TokenExpiry).Unix()
	claims["iat"] = time.Now().Unix()
	claims["sub"] = user.ID.String()
	claims["aud"] = j.Audience
	claims["email"] = user.Email
	claims["role"] = user.Role
	claims["typ"] = "JWT"

	if user.Role == database.UserRoleVendors {
		vendorRepo := repository.NewVendorRepository()
		vendor, err := vendorRepo.GetVendorByUUID(user.ID)
		if err != nil {
			return "", err
		}
		claims["vendorId"] = vendor.ID
		claims["vendorStatus"] = vendor.Status.VendorsStatus
	}

	signedAccessToken, err := token.SignedString([]byte(j.Secret))
	if err != nil {
		return "", err
	}

	return signedAccessToken, nil
}

func (j *Auth) getCookie(token string) *http.Cookie {
	return &http.Cookie{
		Name:     j.CookieName,
		Path:     j.CookiePath,
		Value:    token,
		Domain:   j.CookieDomain,
		Expires:  time.Now().Add(j.TokenExpiry),
		MaxAge:   int(j.TokenExpiry.Seconds()),
		SameSite: http.SameSiteStrictMode,
		HttpOnly: true,
		Secure:   true,
	}
}

func (j *Auth) GenerateTokenByEmail(email string) (string, error) {
	claims := jwt.MapClaims{
		"iss":   j.Issuer,
		"email": email,
		"aud":   j.Audience,
		"typ":   "JWT",
		"exp":   time.Now().Add(j.TokenExpiry).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(j.Secret))
}
