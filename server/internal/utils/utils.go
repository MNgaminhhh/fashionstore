package utils

import (
	"backend/internal/database"
	"database/sql"
	"encoding/json"
	"github.com/google/uuid"
	"log"
	"time"
)

func OptionalNullInt16(i int16, valid bool) sql.NullInt16 {
	if valid {
		return sql.NullInt16{Int16: i, Valid: true}
	}
	return sql.NullInt16{Valid: false}
}

func OptionalNullString(s *string) sql.NullString {
	if s != nil {
		return sql.NullString{String: *s, Valid: true}
	}
	return sql.NullString{Valid: false}
}

func OptionalNullBool(b *bool) sql.NullBool {
	if b != nil {
		return sql.NullBool{Bool: *b, Valid: true}
	}
	return sql.NullBool{Valid: false}
}

func OptionalNullProductStatus(s *string) database.NullProductStatus {
	if s != nil {
		return database.NullProductStatus{
			ProductStatus: database.ProductStatus(*s),
			Valid:         true,
		}
	}
	return database.NullProductStatus{Valid: false}
}

func OptionalNullInt64(i *int64) sql.NullInt64 {
	if i != nil {
		return sql.NullInt64{Int64: *i, Valid: true}
	}
	return sql.NullInt64{Valid: false}
}

func OptionalNullUUID(u *string) uuid.NullUUID {
	if u != nil {
		parsedUUID, err := uuid.Parse(*u)
		if err == nil {
			return uuid.NullUUID{UUID: parsedUUID, Valid: true}
		}
	}
	return uuid.NullUUID{Valid: false}
}

func OptionalUUID(u uuid.UUID, valid bool) uuid.UUID {
	if valid {
		return u
	}
	return uuid.Nil
}

func OptionalInt64(i *int64) int64 {
	if i != nil {
		return *i
	}
	return 0
}

func GetOrDefault[T any](value *T, defaultVal T) T {
	if value != nil {
		return *value
	}
	return defaultVal
}

func ParseISO8601(datetime string) sql.NullTime {
	parsedTime, err := time.Parse(time.RFC3339, datetime)
	if err != nil {
		log.Printf("Failed to parse datetime: %v", err)
		return sql.NullTime{Valid: false}
	}
	return sql.NullTime{Time: parsedTime, Valid: true}
}

func ParseOptionalUUID(u *string) uuid.NullUUID {
	if u != nil {
		parsedUUID, err := uuid.Parse(*u)
		if err == nil {
			return uuid.NullUUID{UUID: parsedUUID, Valid: true}
		}
		log.Printf("Failed to parse UUID: %v", err)
	}
	return uuid.NullUUID{Valid: false}
}

func ParseOptionalISO8601(datetime *string) sql.NullTime {
	if datetime != nil {
		return ParseISO8601(*datetime)
	}
	return sql.NullTime{Valid: false}
}

func OptionalNullStringValue(s string) sql.NullString {
	if s != "" {
		return sql.NullString{String: s, Valid: true}
	}
	return sql.NullString{Valid: false}
}

func OptionalNullProductStatusValue(s string) database.NullProductStatus {
	if s != "" {
		return database.NullProductStatus{
			ProductStatus: database.ProductStatus(s),
			Valid:         true,
		}
	}
	return database.NullProductStatus{Valid: false}
}

func MarshalImages(images []string) []byte {
	imagesJSON, err := json.Marshal(images)
	if err != nil {
		log.Printf("Failed to marshal images: %v", err)
		return nil
	}
	return imagesJSON
}
