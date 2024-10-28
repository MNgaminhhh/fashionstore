package controller

import (
	"backend/internal/service"
	"backend/pkg/response"
	"github.com/google/uuid"
	"github.com/labstack/echo"
)

type UploadFileController struct {
	uploadFileService service.IUploadFileService
}

func NewUploadFileController(uploadFileService service.IUploadFileService) *UploadFileController {
	return &UploadFileController{uploadFileService: uploadFileService}
}

func (uc *UploadFileController) UploadFile(c echo.Context) error {
	id := c.Get("uuid").(string)
	userID, _ := uuid.Parse(id)
	form, err := c.MultipartForm()
	if err != nil {
		return response.ErrorResponse(c, response.ErrCodeCannotUploadFile, "Failed to upload file.")
	}
	files := form.File["file"]
	var filePath []string

	for _, file := range files {
		code, path := uc.uploadFileService.UploadFile(file, userID)
		if code != response.SuccessCode {
			return response.ErrorResponse(c, response.ErrCodeCannotUploadFile, "Failed to upload file.")
		}
		filePath = append(filePath, *path)
	}
	data := map[string]interface{}{
		"files": filePath,
		"total": len(filePath),
	}
	return response.SuccessResponse(c, response.SuccessCode, data)
}
