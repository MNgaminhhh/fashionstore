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
	"fmt"
	"log"
	"os"
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
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
	GetAllUsers(customParam validator.FilterUserRequest) (int, map[string]interface{})
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

type UserResponse struct {
	ID          uuid.UUID `json:"id"`
	Email       string    `json:"email"`
	Name        string    `json:"name"`
	Dob         string    `json:"dob"`
	Status      string    `json:"status"`
	PhoneNumber string    `json:"phone_number"`
}

func (us *userService) Login(email string, password string) (int, map[string]interface{}) {
	user, err := us.userRepo.GetUserByEmail(email)
	if err != nil {
		return response.ErrCodeEmailNotFound, nil
	}
	if !CheckPasswordHash(password, user.Password) {
		return response.ErrCodeIncorrectPassword, nil
	}
	if user.Status.UserStatus == database.UserStatusInactive {
		return response.ErrCodeUserInactive, nil
	}
	if user.Status.UserStatus == database.UserStatusLock {
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
	user, err := us.userRepo.GetUserByEmail(email)
	if err != nil {
		return response.ErrCodeUserNotFound
	}
	if user.Status.UserStatus == database.UserStatusLock {
		return response.ErrCodeUserLocked
	}
	err = us.userRepo.UpdateStatus(email, status)
	if err != nil {
		return response.ErrCodeEmailNotFound
	}
	return response.SuccessCode
}

func (us *userService) CreateNewUser(email string, password string, confirmed string) int {
	if password != confirmed {
		return response.ErrCodeIncorrectConfirmedPassword
	}
	passwordHash, _ := HashPassword(password)
	err := us.userRepo.CreateNewUser(email, passwordHash)
	if err != nil {
		var pqError *pq.Error
		if errors.As(err, &pqError) {
			return pg_error.GetMessageError(pqError)
		}
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
		Host:     "smtp.gmail.com",
		Port:     465,
		Username: "minhngltt@gmail.com",
		Password: "vpwq qqar wpyy zgmn",
	})

	link := fmt.Sprintf("http://localhost:3000%s?token=%s", linkPath, token)
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
	return us.SendEmailWithToken(email, "Đặt lại mật khẩu", "/reset-password", "MTShop Reset Password", time.Minute*5, os.Getenv("RESET_PASSWORD_SECRET"))
}

func (us *userService) SendEmailVerify(email string) int {
	return us.SendEmailWithToken(email, "kích hoạt tài khoản", "/verify-account", "MTShop Verify Email", time.Minute*5, os.Getenv("ACTIVE_SECRET"))
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

func (us *userService) GetAllUsers(customParam validator.FilterUserRequest) (int, map[string]interface{}) {
	param := database.GetAllUserParams{
		Column1: sql.NullString{
			Valid: customParam.FullName != nil,
		},
		Dob: sql.NullTime{
			Valid: customParam.Dob != nil,
		},
		Column3: sql.NullString{
			Valid: customParam.Email != nil,
		},
		Status: database.NullUserStatus{
			UserStatus: "",
			Valid:      false,
		},
		Column5: sql.NullString{
			Valid: customParam.PhoneNumber != nil,
		},
	}
	if customParam.FullName != nil {
		param.Column1 = sql.NullString{
			Valid:  true,
			String: *customParam.FullName,
		}
	}
	if customParam.Dob != nil {
		dob, err := time.Parse("02-01-2006", *customParam.Dob)
		if err != nil {
			return response.ErrCodeIncorrectDateFormat, nil
		}
		param.Dob = sql.NullTime{
			Valid: true,
			Time:  dob,
		}
	}
	if customParam.Email != nil {
		param.Column3 = sql.NullString{
			Valid:  true,
			String: *customParam.Email,
		}
	}
	if customParam.Status != nil {
		status := database.UserStatus(*customParam.Status)
		param.Status.UserStatus = status
		param.Status.Valid = true
	}
	if customParam.PhoneNumber != nil {
		param.Column5 = sql.NullString{
			Valid:  true,
			String: *customParam.PhoneNumber,
		}
	}
	users, err := us.userRepo.GetAllUser(param)
	if err != nil {
		return response.ErrCodeInternal, nil
	}
	limit := len(users)
	page := 1
	totalResults := len(users)
	if customParam.Limit != nil {
		limit = *customParam.Limit
	}
	if customParam.Page != nil {
		page = *customParam.Page
	}

	totalPages := internal.CalculateTotalPages(len(users), limit)
	users = internal.Paginate(users, page, limit)
	var data []UserResponse
	for _, user := range users {
		data = append(data, *mapUserToResponse(user))
	}
	return response.SuccessCode, map[string]interface{}{
		"total_pages":   totalPages,
		"total_results": totalResults,
		"page":          page,
		"users":         data,
	}
}

func mapUserToResponse(user database.User) *UserResponse {
	return &UserResponse{
		ID:          user.ID,
		Email:       user.Email,
		Name:        user.FullName.String,
		Dob:         user.Dob.Time.String(),
		Status:      string(user.Status.UserStatus),
		PhoneNumber: user.PhoneNumber.String,
	}
}
