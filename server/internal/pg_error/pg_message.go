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
	log.Println("constraint", name)
	switch string(code) {
	case string(UniqueViolation):
		if name == "unique_child_name_per_sub_cate" || name == "unique_sub_name_per_category" || name == "categories_name_key" {
			return response.ErrCodeNameAlreadyUsed
		}
		if name == "unique_child_name_code_per_sub_cate" || name == "unique_sub_name_code_per_category" || name == "categories_name_code_key" {
			return response.ErrCodeNameCodeAlreadyUsed
		}
		if name == "unique_coupon_code" {
			return response.ErrCodeCouponIsAlreadyExist
		}
		if name == "shipping_rules_min_order_cost_key" {
			return response.ErrCodeUniqueMinOrderCost
		}
		return response.ErrCodeConflict
	case string(ForeignKeyViolation):
		if name == "child_categories_sub_category_id_fkey" || name == "sub_categories_category_id_fkey" {
			return response.ErrCodeCateParentNotFound
		}
		return response.ErrCodeForeignKey
	case "23514":
		if name == "flash_sales_check" {
			return response.ErrCodeInvalidEndDate
		}
		if name == "skus_in_stock_check" {
			return response.ErrCodeInStockCheck
		}
		return response.ErrCodeDatabase
	default:
		return response.ErrCodeDatabase
	}
}
