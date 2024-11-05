package service

import (
	"backend/internal"
	"backend/internal/database"
	"backend/internal/repository"
	"backend/internal/validator"
	"backend/pkg/response"
	"errors"
	"github.com/google/uuid"
	"github.com/lib/pq"
	"log"
	"sort"
	"time"
)

type ResponseVendorData struct {
	ID           string    `json:"id"`
	UserID       string    `json:"user_id"`
	FullName     string    `json:"full_name"`
	PhoneNumber  string    `json:"phone_number"`
	StoreName    string    `json:"store_name"`
	Status       string    `json:"status"`
	Description  string    `json:"description"`
	Address      string    `json:"address"`
	Banner       string    `json:"banner"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	UserFullName string    `json:"user_full_name,omitempty"`
	UserAvatar   string    `json:"user_avatar,omitempty"`
	UserEmail    string    `json:"user_email,omitempty"`
}

type IVendorService interface {
	BecomeVendor(nVendor *database.Vendor) int
	UpdateVendorStatus(userId uuid.UUID, adminId uuid.UUID, status database.VendorsStatus) int
	GetVendor(vendorId uuid.UUID) (int, *ResponseVendorData)
	GetAllVendors(customParams validator.FilterVendorRequest, sortBy string, sortOrder string) (int, map[string]interface{})
}

type VendorService struct {
	vendorRepository repository.IVendorRepository
}

func NewVendorService(repository repository.IVendorRepository) IVendorService {
	return &VendorService{repository}
}

func (vs *VendorService) BecomeVendor(nVendor *database.Vendor) int {
	err := vs.vendorRepository.BecomeVendor(nVendor)
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) {
			if pqErr.Code == "23505" {
				log.Println("unique")
				if pqErr.Constraint == "vendors_email_key" {
					return response.ErrCodeEmailAlreadyUsed
				}
				if pqErr.Constraint == "vendors_phone_number_key" {
					return response.ErrPhoneNumberAlreadyUsed
				}
			}
			return response.ErrCodeInternal
		}
	}
	return response.SuccessCode
}

func (vs *VendorService) UpdateVendorStatus(userId uuid.UUID, adminId uuid.UUID, status database.VendorsStatus) int {
	err := vs.vendorRepository.UpdateStatus(userId, adminId, status)
	if err != nil {
		return response.ErrCodeInternal
	}
	return response.SuccessCode
}

func (vs *VendorService) GetVendor(vendorId uuid.UUID) (int, *ResponseVendorData) {
	vendor, err := vs.vendorRepository.GetVendor(vendorId)
	if err != nil {
		return response.ErrCodeNotFound, nil
	}
	return response.SuccessCode, MapVendorToResponse(vendor)
}

func (vs *VendorService) GetAllVendors(customParams validator.FilterVendorRequest, sortBy string, sortOrder string) (int, map[string]interface{}) {
	vendors, err := vs.vendorRepository.GetAllVendors(customParams)
	if err != nil {
		log.Fatal(err)
		return response.ErrCodeInternal, nil
	}
	responseData := make([]ResponseVendorData, len(vendors))
	for i, vendor := range vendors {
		responseData[i] = ResponseVendorData{
			ID:          vendor.ID.String(),
			UserID:      vendor.UserID.String(),
			FullName:    vendor.FullName,
			PhoneNumber: vendor.PhoneNumber,
			StoreName:   vendor.StoreName,
			Status:      string(vendor.Status.VendorsStatus),
			Description: vendor.Description.String,
			Address:     vendor.Address,
			Banner:      vendor.Banner,
			CreatedAt:   vendor.CreatedAt.Time,
			UpdatedAt:   vendor.UpdatedAt.Time,
		}
	}
	if sortBy == "" {
		sortBy = "createdAt"
	}
	if sortOrder == "" {
		sortOrder = "desc"
	}
	limit := len(responseData)
	page := 1
	if customParams.Limit != 0 {
		limit = customParams.Limit
	}
	if customParams.Page != 0 {
		page = customParams.Page
	}
	totalPages := internal.CalculateTotalPages(len(vendors), limit)
	responseData = internal.Paginate(responseData, page, limit)
	responseData = SortData(responseData, sortBy, sortOrder)
	data := map[string]interface{}{
		"page":          page,
		"total_pages":   totalPages,
		"total_results": len(responseData),
		"vendors":       responseData,
	}
	return response.SuccessCode, data
}

func MapVendorToResponse(vendor *database.GetVendorByIdRow) *ResponseVendorData {
	return &ResponseVendorData{
		ID:           vendor.VendorID.String(),
		UserID:       vendor.UserID.String(),
		FullName:     vendor.VendorFullName,
		PhoneNumber:  vendor.PhoneNumber,
		StoreName:    vendor.StoreName,
		Status:       string(vendor.Status.VendorsStatus),
		Description:  vendor.Description.String,
		Address:      vendor.Address,
		Banner:       vendor.Banner,
		CreatedAt:    vendor.CreatedAt.Time,
		UpdatedAt:    vendor.UpdatedAt.Time,
		UserFullName: vendor.UserFullName.String,
		UserAvatar:   vendor.UserAvatar.String,
		UserEmail:    vendor.UserEmail,
	}
}

func SortData(data []ResponseVendorData, sortBy, sortOrder string) []ResponseVendorData {
	switch sortBy {
	case "storeName":
		sort.Slice(data, func(i, j int) bool {
			if sortOrder == "desc" {
				return data[i].StoreName > data[j].StoreName
			}
			return data[i].StoreName < (data[j].StoreName)
		})

	case "status":
		sort.Slice(data, func(i, j int) bool {
			if sortOrder == "desc" {
				return data[i].Status > data[j].Status
			}
			return data[i].Status < (data[j].Status)
		})
	default:
		sort.Slice(data, func(i, j int) bool {
			if sortOrder == "desc" {
				return data[i].CreatedAt.After(data[j].CreatedAt)
			}
			return data[i].CreatedAt.Before(data[j].CreatedAt)
		})
	}
	return data
}
