// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0

package database

import (
	"database/sql"
	"database/sql/driver"
	"fmt"

	"github.com/google/uuid"
)

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
	Status      UserStatus
	FullName    sql.NullString
	PhoneNumber sql.NullString
	Dob         sql.NullTime
	CreatedAt   sql.NullTime
	UpdatedAt   sql.NullTime
	Role        UserRole
	Avt         sql.NullString
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
