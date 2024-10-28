package repository

import (
	"fmt"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"io"
	"os"
)

type AWS struct {
	Bucket string
	Key    string
}

type IUploadFileRepository interface {
	UploadFile(file io.Reader, fileName string) (*string, error)
}

type UploadFileRepository struct {
	aws *AWS
}

func NewUploadFileRepository() IUploadFileRepository {
	return &UploadFileRepository{
		aws: &AWS{
			Bucket: os.Getenv("BUCKET"),
			Key:    os.Getenv("AWS_KEY"),
		},
	}
}

func (ur *UploadFileRepository) UploadFile(file io.Reader, fileName string) (*string, error) {
	sess := session.Must(session.NewSession(&aws.Config{
		Region:      aws.String(os.Getenv("AWS_REGION")),
		Credentials: credentials.NewStaticCredentials(os.Getenv("AWS_ACCESS_KEY_ID"), os.Getenv("AWS_SECRET_ACCESS_KEY"), ""),
	}))

	uploader := s3manager.NewUploader(sess)
	key := fmt.Sprintf("%s/%s", "image", fileName)
	result, err := uploader.Upload(&s3manager.UploadInput{
		Bucket: aws.String(ur.aws.Bucket),
		Key:    aws.String(key),
		Body:   file,
		ACL:    aws.String("public-read"),
	})
	if err != nil {
		return nil, err
	}
	return &result.Location, nil
}
