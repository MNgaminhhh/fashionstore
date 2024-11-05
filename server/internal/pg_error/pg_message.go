package pg_error

import (
	"backend/pkg/response"
	"github.com/lib/pq"
	"log"
)

func GetMessageError(pqError *pq.Error) int {
	err := pqError
	code := err.Code
	name := err.Constraint
	log.Println("code", code)
	switch string(code) {
	case string(UniqueViolation):

		log.Println("name", name)
		if name == "unique_child_name_per_sub_cate" || name == "unique_sub_name_per_category" || name == "categories_name_key" {
			return response.ErrCodeNameAlreadyUsed
		}
		if name == "unique_child_name_code_per_sub_cate" || name == "unique_sub_name_code_per_category" || name == "categories_name_code_key" {
			return response.ErrCodeNameCodeAlreadyUsed
		}
		return response.ErrCodeInternal
	case string(ForeignKeyViolation):
		if name == "child_categories_sub_category_id_fkey" || name == "sub_categories_category_id_fkey" {
			return response.ErrCodeCateParentNotFound
		}
		return response.ErrCodeInternal

	default:
		return response.ErrCodeInternal
	}
}
