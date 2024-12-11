package enum

type UserStatus string

const (
	ACTIVE   UserStatus = "active"
	INACTIVE UserStatus = "inactive"
	LOCKED   UserStatus = "locked"
)

func (s UserStatus) String() string {
	return string(s)
}
