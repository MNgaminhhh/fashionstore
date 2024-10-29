package service

import (
	"backend/internal/database"
	"backend/internal/repository"
	"backend/internal/validator"
	"backend/pkg/response"
	"database/sql"
	"errors"
	"fmt"
	"github.com/google/uuid"
	"github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
	"log"
	"os"
	"time"
)

type IUserService interface {
	Login(email string, password string) (int, map[string]interface{})
	UpdateUserStatus(email string, status string) int
	CreateNewUser(email string, password string, confirmed string) int
	SendEmailResetPassword(email string) int
	ResetPassword(email string, newPassword string, confirmPassword string) int
	SendEmailVerify(email string) int
	GetUserInformation(uuid uuid.UUID) (int, *database.User)
	UpdateUserInformation(customParam validator.UpdateUserRequest, email string) int
}

type userService struct {
	userRepo repository.IUserRepository
	auth     Auth
}

func NewUserService(
	userRepo repository.IUserRepository,
) IUserService {
	return &userService{
		userRepo: userRepo,
		auth: Auth{
			Issuer:       "mtshop.com",
			Audience:     "",
			Secret:       os.Getenv("ACCESS_SECRET"),
			TokenExpiry:  time.Hour * 24 * 7,
			CookieDomain: "localhost",
			CookiePath:   "/",
			CookieName:   "access_cookie",
		},
	}
}

func (us *userService) Login(email string, password string) (int, map[string]interface{}) {
	user, err := us.userRepo.GetUserByEmail(email)
	if err != nil {
		return response.ErrCodeEmailNotFound, nil
	}
	if !CheckPasswordHash(password, user.Password) {
		return response.ErrCodeIncorrectPassword, nil
	}
	if user.Status == database.UserStatusInactive {
		return response.ErrCodeUserInactive, nil
	}
	if user.Status == database.UserStatusLock {
		return response.ErrCodeUserLocked, nil
	}

	tokens, err := us.auth.GenerateToken(user)

	if err != nil {
		return response.ErrCodeInternal, nil
	}

	cookie := us.auth.getCookie(tokens)

	data := map[string]interface{}{
		"access_token": tokens,
		"cookie":       cookie,
	}

	return response.SuccessCode, data
}

func (us *userService) UpdateUserStatus(email string, status string) int {
	err := us.userRepo.UpdateStatus(email, status)
	if err != nil {
		return response.ErrCodeEmailNotFound
	}
	return response.SuccessCode
}

func (us *userService) CreateNewUser(email string, password string, confirmed string) int {
	user, _ := us.userRepo.GetUserByEmail(email)
	if user != nil {
		return response.ErrCodeEmailAlreadyUsed
	}
	if password != confirmed {
		return response.ErrCodeIncorrectConfirmedPassword
	}
	passwordHash, _ := HashPassword(password)
	err := us.userRepo.CreateNewUser(email, passwordHash)
	if err != nil {
		return response.ErrCodeInternal
	}
	result := make(chan int)
	go func() {
		result <- us.SendEmailVerify(email)
	}()

	sendEmailResult := <-result
	if sendEmailResult != response.SuccessCode {
		return sendEmailResult
	}

	return response.SuccessCode
}

func (us *userService) ResetPassword(email string, newPassword string, confirmPassword string) int {
	if newPassword != confirmPassword {
		return response.ErrCodeIncorrectConfirmedPassword
	}

	hash, err := HashPassword(newPassword)
	if err != nil {
		return response.ErrCodeInternal
	}
	errResetPass := us.userRepo.UpdatePassword(email, hash)
	if errResetPass != nil {
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (us *userService) SendEmailWithToken(email, purpose, linkPath, subject string, tokenExpiry time.Duration, secret string) int {
	auth := Auth{
		Issuer:       "mtshop.com",
		Audience:     "",
		Secret:       secret,
		TokenExpiry:  tokenExpiry,
		CookieDomain: "localhost",
		CookiePath:   linkPath,
		CookieName:   fmt.Sprintf("%s-token", purpose),
	}

	token, err := auth.GenerateTokenByEmail(email)
	if err != nil {
		return response.ErrCodeInternal
	}

	emailService := NewEmailService(SMTPServer{
		Host:     "sandbox.smtp.mailtrap.io",
		Port:     2525,
		Username: "75450a29e28cd1",
		Password: "4835aafc0d3d8e",
	})

	link := fmt.Sprintf("http://localhost:8080%s?token=%s", linkPath, token)
	content := fmt.Sprintf(`
	<html>
		<body>
			<p>Nhấn vào liên kết sau để %s: <a href="%s">%s</a></p>
			<b>Liên kết sẽ hết hạn trong %v phút.</b>
		</body>
	</html>
	`, purpose, link, subject, tokenExpiry.Minutes())

	smtpErr := emailService.SendEmail(subject, content, email)
	if smtpErr != nil {
		log.Fatal("Error sending email:", smtpErr)
		return response.ErrCodeInternal
	}

	return response.SuccessCode
}

func (us *userService) SendEmailResetPassword(email string) int {
	return us.SendEmailWithToken(email, "Đặt lại mật khẩu", "/api/v1/auth/reset-password", "MTShop Reset Password", time.Minute*5, os.Getenv("RESET_PASSWORD_SECRET"))
}

func (us *userService) SendEmailVerify(email string) int {
	return us.SendEmailWithToken(email, "kích hoạt tài khoản", "/api/v1/auth/verify-email", "MTShop Verify Email", time.Minute*5, os.Getenv("ACTIVE_SECRET"))
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func (us *userService) GetUserInformation(uuid uuid.UUID) (int, *database.User) {
	user, err := us.userRepo.FindByID(uuid)
	if err != nil {
		return response.ErrCodeUserNotFound, nil
	}
	return response.SuccessCode, user
}

func (us *userService) UpdateUserInformation(customParam validator.UpdateUserRequest, email string) int {
	newUser, err := us.userRepo.GetUserByEmail(email)
	if err != nil {
		return response.ErrCodeUserNotFound
	}
	if customParam.FullName != nil {
		newUser.FullName = sql.NullString{
			String: *customParam.FullName,
			Valid:  true,
		}
	}
	if customParam.Dob != nil {
		dob, changeTimeErr := time.Parse("02-01-2006", *customParam.Dob)
		if changeTimeErr != nil {
			return response.ErrCodeIncorrectDateFormat
		}
		newUser.Dob = sql.NullTime{
			Time:  dob,
			Valid: true,
		}
	}
	if customParam.Avt != nil {
		newUser.Avt = sql.NullString{
			String: *customParam.Avt,
			Valid:  true,
		}
	}
	if customParam.PhoneNumber != nil {
		newUser.PhoneNumber = sql.NullString{
			String: *customParam.PhoneNumber,
			Valid:  true,
		}
	}
	err = us.userRepo.UpdateUser(newUser)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			if pqErr.Code == "23505" {
				log.Println("unique")
				if pqErr.Constraint == "users_phone_number_key" {
					return response.ErrPhoneNumberAlreadyUsed
				}
			}
			return response.ErrCodeInternal
		}
	}
	return response.SuccessCode
}
