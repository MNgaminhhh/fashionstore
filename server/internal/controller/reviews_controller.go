package controller

import (
	"backend/internal/database"
	"backend/internal/service"
	"backend/internal/validator"
	"backend/pkg/response"
	"github.com/labstack/echo"
)

type ReviewsController struct {
	reviewService service.IReviewsService
}

func NewReviewsController(reviewService service.IReviewsService) *ReviewsController {
	return &ReviewsController{
		reviewService: reviewService,
	}
}

func (rc *ReviewsController) CreateReview(c echo.Context) error {
	userId := c.Get("uuid").(string)
	role := c.Get("role").(database.UserRole)
	if role != database.UserRoleCustomer {
		return response.ErrorResponse(c, response.ErrCodeInvalidRole, "create fail")
	}
	reqParam := validator.CreateReviewValidator{}
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "create fail")
	}
	if err := c.Validate(reqParam); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}
	code := rc.reviewService.UserReviewProduct(userId, reqParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "review fail")
	}
	return response.SuccessResponse(c, code, "Đánh giá thành công")
}

func (rc *ReviewsController) UpdateReview(c echo.Context) error {
	userId := c.Get("uuid").(string)
	role := c.Get("role").(database.UserRole)
	if role != database.UserRoleCustomer {
		return response.ErrorResponse(c, response.ErrCodeInvalidRole, "update fail")
	}
	reqParam := validator.UpdateReviewValidator{}
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "update fail")
	}
	if reqParam.Comment != nil {
		if err := c.Validate(reqParam); err != nil {
			return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
		}
	}
	id := c.Param("id")
	code := rc.reviewService.UpdateReview(userId, id, reqParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "update fail")
	}
	return response.SuccessResponse(c, code, "Cập nhật thành công!")
}

func (rc *ReviewsController) DeleteReview(c echo.Context) error {
	userId := c.Get("uuid").(string)
	role := c.Get("role").(database.UserRole)
	if role != database.UserRoleCustomer {
		return response.ErrorResponse(c, response.ErrCodeInvalidRole, "delete fail")
	}
	id := c.Param("id")
	code := rc.reviewService.DeleteReview(id, userId)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "delete fail")
	}
	return response.SuccessResponse(c, code, "Xóa thành công!")
}

func (rc *ReviewsController) CreateComment(c echo.Context) error {
	userId := c.Get("uuid").(string)
	var reqParam validator.CreateCommentValidator
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "create fail")
	}
	if err := c.Validate(reqParam); err != nil {
		return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
	}
	code := rc.reviewService.UserComment(userId, reqParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "comment fail")
	}
	return response.SuccessResponse(c, code, "Bình luận thành công!")
}

func (rc *ReviewsController) UpdateComment(c echo.Context) error {
	userId := c.Get("uuid").(string)
	id := c.Param("id")
	var reqParam validator.UpdateComment
	if err := c.Bind(&reqParam); err != nil {
		return response.ErrorResponse(c, response.ErrCodeParamInvalid, "update fail")
	}
	if reqParam.Comment != nil {
		if err := c.Validate(reqParam); err != nil {
			return response.ValidationResponse(c, response.ErrCodeParamInvalid, err)
		}
	}
	code := rc.reviewService.UpdateComment(userId, id, reqParam)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "comment fail")
	}
	return response.SuccessResponse(c, code, "Cập nhật thành công!")
}

func (rc *ReviewsController) DeleteComment(c echo.Context) error {
	userId := c.Get("uuid").(string)
	id := c.Param("id")
	code := rc.reviewService.DeleteComment(id, userId)
	if code != response.SuccessCode {
		return response.ErrorResponse(c, code, "comment fail")
	}
	return response.SuccessResponse(c, code, "Xóa thành công!")
}
