// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0

package database

import (
	"database/sql"
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
)

type ComparisonOperator string

const (
	ComparisonOperatorValue0 ComparisonOperator = ">"
	ComparisonOperatorValue1 ComparisonOperator = ">="
	ComparisonOperatorValue2 ComparisonOperator = "="
)

func (e *ComparisonOperator) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = ComparisonOperator(s)
	case string:
		*e = ComparisonOperator(s)
	default:
		return fmt.Errorf("unsupported scan type for ComparisonOperator: %T", src)
	}
	return nil
}

type NullComparisonOperator struct {
	ComparisonOperator ComparisonOperator
	Valid              bool // Valid is true if ComparisonOperator is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullComparisonOperator) Scan(value interface{}) error {
	if value == nil {
		ns.ComparisonOperator, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.ComparisonOperator.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullComparisonOperator) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.ComparisonOperator), nil
}

type ComponentsType string

const (
	ComponentsTypeMegaMenu1name ComponentsType = "MegaMenu1.name"
	ComponentsTypeMegaMenu2name ComponentsType = "MegaMenu2.name"
	ComponentsTypeNull          ComponentsType = "null"
)

func (e *ComponentsType) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = ComponentsType(s)
	case string:
		*e = ComponentsType(s)
	default:
		return fmt.Errorf("unsupported scan type for ComponentsType: %T", src)
	}
	return nil
}

type NullComponentsType struct {
	ComponentsType ComponentsType
	Valid          bool // Valid is true if ComponentsType is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullComponentsType) Scan(value interface{}) error {
	if value == nil {
		ns.ComponentsType, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.ComponentsType.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullComponentsType) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.ComponentsType), nil
}

type ConditionField string

const (
	ConditionFieldPrice        ConditionField = "price"
	ConditionFieldShippingCost ConditionField = "shipping_cost"
	ConditionFieldProductType  ConditionField = "product_type"
)

func (e *ConditionField) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = ConditionField(s)
	case string:
		*e = ConditionField(s)
	default:
		return fmt.Errorf("unsupported scan type for ConditionField: %T", src)
	}
	return nil
}

type NullConditionField struct {
	ConditionField ConditionField
	Valid          bool // Valid is true if ConditionField is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullConditionField) Scan(value interface{}) error {
	if value == nil {
		ns.ConditionField, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.ConditionField.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullConditionField) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.ConditionField), nil
}

type DiscountType string

const (
	DiscountTypeShippingFixed      DiscountType = "shipping_fixed"
	DiscountTypeShippingPercentage DiscountType = "shipping_percentage"
	DiscountTypeFixed              DiscountType = "fixed"
	DiscountTypePercentage         DiscountType = "percentage"
)

func (e *DiscountType) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = DiscountType(s)
	case string:
		*e = DiscountType(s)
	default:
		return fmt.Errorf("unsupported scan type for DiscountType: %T", src)
	}
	return nil
}

type NullDiscountType struct {
	DiscountType DiscountType
	Valid        bool // Valid is true if DiscountType is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullDiscountType) Scan(value interface{}) error {
	if value == nil {
		ns.DiscountType, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.DiscountType.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullDiscountType) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.DiscountType), nil
}

type ProductStatus string

const (
	ProductStatusInactive ProductStatus = "inactive"
	ProductStatusActive   ProductStatus = "active"
)

func (e *ProductStatus) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = ProductStatus(s)
	case string:
		*e = ProductStatus(s)
	default:
		return fmt.Errorf("unsupported scan type for ProductStatus: %T", src)
	}
	return nil
}

type NullProductStatus struct {
	ProductStatus ProductStatus
	Valid         bool // Valid is true if ProductStatus is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullProductStatus) Scan(value interface{}) error {
	if value == nil {
		ns.ProductStatus, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.ProductStatus.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullProductStatus) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.ProductStatus), nil
}

type SkuStatus string

const (
	SkuStatusActive     SkuStatus = "active"
	SkuStatusInactive   SkuStatus = "inactive"
	SkuStatusOutOfStock SkuStatus = "out_of_stock"
)

func (e *SkuStatus) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = SkuStatus(s)
	case string:
		*e = SkuStatus(s)
	default:
		return fmt.Errorf("unsupported scan type for SkuStatus: %T", src)
	}
	return nil
}

type NullSkuStatus struct {
	SkuStatus SkuStatus
	Valid     bool // Valid is true if SkuStatus is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullSkuStatus) Scan(value interface{}) error {
	if value == nil {
		ns.SkuStatus, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.SkuStatus.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullSkuStatus) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.SkuStatus), nil
}

type UserRole string

const (
	UserRoleAdmin    UserRole = "admin"
	UserRoleCustomer UserRole = "customer"
	UserRoleVendors  UserRole = "vendors"
)

func (e *UserRole) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = UserRole(s)
	case string:
		*e = UserRole(s)
	default:
		return fmt.Errorf("unsupported scan type for UserRole: %T", src)
	}
	return nil
}

type NullUserRole struct {
	UserRole UserRole
	Valid    bool // Valid is true if UserRole is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullUserRole) Scan(value interface{}) error {
	if value == nil {
		ns.UserRole, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.UserRole.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullUserRole) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.UserRole), nil
}

type UserStatus string

const (
	UserStatusActive   UserStatus = "active"
	UserStatusInactive UserStatus = "inactive"
	UserStatusLock     UserStatus = "lock"
)

func (e *UserStatus) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = UserStatus(s)
	case string:
		*e = UserStatus(s)
	default:
		return fmt.Errorf("unsupported scan type for UserStatus: %T", src)
	}
	return nil
}

type NullUserStatus struct {
	UserStatus UserStatus
	Valid      bool // Valid is true if UserStatus is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullUserStatus) Scan(value interface{}) error {
	if value == nil {
		ns.UserStatus, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.UserStatus.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullUserStatus) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.UserStatus), nil
}

type VariantsStatus string

const (
	VariantsStatusActive   VariantsStatus = "active"
	VariantsStatusInactive VariantsStatus = "inactive"
)

func (e *VariantsStatus) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = VariantsStatus(s)
	case string:
		*e = VariantsStatus(s)
	default:
		return fmt.Errorf("unsupported scan type for VariantsStatus: %T", src)
	}
	return nil
}

type NullVariantsStatus struct {
	VariantsStatus VariantsStatus
	Valid          bool // Valid is true if VariantsStatus is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullVariantsStatus) Scan(value interface{}) error {
	if value == nil {
		ns.VariantsStatus, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.VariantsStatus.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullVariantsStatus) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.VariantsStatus), nil
}

type VendorsStatus string

const (
	VendorsStatusPending  VendorsStatus = "pending"
	VendorsStatusAccepted VendorsStatus = "accepted"
	VendorsStatusRejected VendorsStatus = "rejected"
	VendorsStatusNull     VendorsStatus = "null"
)

func (e *VendorsStatus) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = VendorsStatus(s)
	case string:
		*e = VendorsStatus(s)
	default:
		return fmt.Errorf("unsupported scan type for VendorsStatus: %T", src)
	}
	return nil
}

type NullVendorsStatus struct {
	VendorsStatus VendorsStatus
	Valid         bool // Valid is true if VendorsStatus is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullVendorsStatus) Scan(value interface{}) error {
	if value == nil {
		ns.VendorsStatus, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.VendorsStatus.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullVendorsStatus) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.VendorsStatus), nil
}

type Banner struct {
	ID          uuid.UUID
	BannerImage string
	Title       string
	Description sql.NullString
	Text        string
	Link        sql.NullString
	Serial      sql.NullInt32
	Status      int32
	CreatedAt   sql.NullTime
	UpdatedAt   sql.NullTime
}

type Brand struct {
	ID        uuid.UUID
	Sequence  int32
	StoreID   uuid.UUID
	Name      string
	Image     string
	Visible   sql.NullBool
	CreatedAt sql.NullTime
	UpdatedAt sql.NullTime
}

type Category struct {
	ID        uuid.UUID
	Name      string
	NameCode  string
	Url       sql.NullString
	Icon      sql.NullString
	Status    sql.NullInt32
	Component NullComponentsType
	CreatedAt sql.NullTime
	UpdatedAt sql.NullTime
}

type ChildCategory struct {
	ID            uuid.UUID
	SubCategoryID uuid.NullUUID
	Name          string
	NameCode      string
	Url           sql.NullString
	Status        sql.NullInt32
	CreatedAt     sql.NullTime
	UpdatedAt     sql.NullTime
}

type Condition struct {
	ID       uuid.UUID
	Field    ConditionField
	Operator ComparisonOperator
	Value    json.RawMessage
}

type ConditionsCoupon struct {
	CouponID          uuid.UUID
	ConditionID       uuid.UUID
	ConditionDescribe string
}

type Coupon struct {
	ID        uuid.UUID
	Name      string
	Code      string
	Quantity  int32
	StartDate time.Time
	EndDate   time.Time
	Type      DiscountType
	Discount  int32
	TotalUsed sql.NullInt32
	MaxPrice  int32
	CreatedAt sql.NullTime
	UpdatedAt sql.NullTime
}

type FlashSale struct {
	ID        uuid.UUID
	StartDate time.Time
	EndDate   time.Time
	CreatedAt sql.NullTime
	UpdatedAt sql.NullTime
}

type FlashSalesItem struct {
	ID           uuid.UUID
	FlashSalesID uuid.UUID
	ProductID    uuid.UUID
	Show         sql.NullBool
	CreatedAt    sql.NullTime
	UpdatedAt    sql.NullTime
}

type Product struct {
	ID               uuid.UUID
	Name             string
	Slug             string
	Images           json.RawMessage
	VendorID         uuid.UUID
	CategoryID       uuid.UUID
	SubCategoryID    uuid.NullUUID
	ChildCategoryID  uuid.NullUUID
	ShortDescription sql.NullString
	LongDescription  sql.NullString
	ProductType      sql.NullString
	Status           NullProductStatus
	IsApproved       sql.NullBool
	CreatedAt        sql.NullTime
	UpdatedAt        sql.NullTime
}

type ProductVariant struct {
	ID        uuid.UUID
	Name      string
	Status    NullVariantsStatus
	ProductID uuid.UUID
	CreatedAt sql.NullTime
	UpdatedAt sql.NullTime
}

type Sku struct {
	ID             uuid.UUID
	ProductID      uuid.UUID
	InStock        sql.NullInt16
	Sku            string
	Price          int64
	Status         SkuStatus
	Offer          sql.NullInt32
	OfferStartDate sql.NullTime
	OfferEndDate   sql.NullTime
	CreatedAt      sql.NullTime
	UpdatedAt      sql.NullTime
}

type SkusVariantOption struct {
	SkuID         uuid.UUID
	VariantOption uuid.UUID
}

type SubCategory struct {
	ID         uuid.UUID
	CategoryID uuid.UUID
	Name       string
	NameCode   string
	Url        sql.NullString
	Status     sql.NullInt32
	Component  NullComponentsType
	CreatedAt  sql.NullTime
	UpdatedAt  sql.NullTime
}

type User struct {
	ID          uuid.UUID
	Email       string
	Password    string
	Status      NullUserStatus
	FullName    sql.NullString
	PhoneNumber sql.NullString
	Dob         sql.NullTime
	CreatedAt   sql.NullTime
	UpdatedAt   sql.NullTime
	Role        UserRole
	Avt         sql.NullString
}

type VariantOption struct {
	ID               uuid.UUID
	ProductVariantID uuid.UUID
	Name             string
	Status           NullVariantsStatus
	CreatedAt        sql.NullTime
	UpdatedAt        sql.NullTime
}

type Vendor struct {
	ID          uuid.UUID
	UserID      uuid.UUID
	FullName    string
	Email       string
	PhoneNumber string
	StoreName   string
	Status      NullVendorsStatus
	Description sql.NullString
	Address     string
	Banner      string
	CreatedAt   sql.NullTime
	UpdatedAt   sql.NullTime
	CreatedBy   uuid.NullUUID
	UpdatedBy   uuid.NullUUID
}
