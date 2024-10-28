package service

import (
	"backend/internal/repository"
	"backend/pkg/response"
	"bytes"
	"fmt"
	"github.com/google/uuid"
	"io"
	"log"
	"mime/multipart"
	"path/filepath"
	"time"
)

type IUploadFileService interface {
	UploadFile(file *multipart.FileHeader, userId uuid.UUID) (int, *string)
}

type UploadFileService struct {
	uploadFileRepository repository.IUploadFileRepository
}

func NewUploadFileService(uploadFileRepository repository.IUploadFileRepository) IUploadFileService {
	return &UploadFileService{uploadFileRepository: uploadFileRepository}
}

func (us *UploadFileService) UploadFile(file *multipart.FileHeader, userId uuid.UUID) (int, *string) {
	src, err := file.Open()
	if err != nil {
		log.Println(err)
		return response.ErrCodeCannotUploadFile, nil
	}
	defer src.Close()
	var buffer bytes.Buffer
	_, err = io.Copy(&buffer, src)
	if err != nil {
		log.Println(err)
		return response.ErrCodeCannotUploadFile, nil
	}
	fileName := generateFileName(file, userId)
	filePath, err := us.uploadFileRepository.UploadFile(&buffer, fileName)
	if err != nil {
		log.Println(err)
		return response.ErrCodeCannotUploadFile, nil
	}
	return response.SuccessCode, filePath
}

func generateFileName(file *multipart.FileHeader, userId uuid.UUID) string {
	id := userId.String()
	timestamp := time.Now().UnixNano() / int64(time.Millisecond)
	extension := filepath.Ext(file.Filename)
	return fmt.Sprintf("%s_%d%s", id, timestamp, extension)
}
