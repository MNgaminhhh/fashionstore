package service

import (
	gomail "gopkg.in/mail.v2"
)

type IEmailService interface {
	SendEmail(subject, content, receiver string) error
}

type SMTPServer struct {
	Host        string
	Port        int
	Username    string
	Password    string
	FromAddress string
}

type EmailService struct {
	SMTPServer *SMTPServer
}

func NewEmailService() IEmailService {
	smtpServer := SMTPServer{
		Host:        "sandbox.smtp.mailtrap.io",
		Port:        587,
		Username:    "cab6a4a40a2f0a",
		Password:    "de69b4aadb663e",
		FromAddress: "hello@example.com",
	}

	return &EmailService{
		SMTPServer: &smtpServer,
	}
}

func (es EmailService) SendEmail(subject string, content string, receiver string) error {
	smtpServer := es.SMTPServer
	message := gomail.NewMessage()
	message.SetHeader("From", smtpServer.FromAddress)
	message.SetHeader("To", receiver)
	message.SetHeader("Subject", subject)
	message.AddAlternative("text/html", content)

	dialer := gomail.NewDialer(smtpServer.Host, smtpServer.Port, smtpServer.Username, smtpServer.Password)

	if err := dialer.DialAndSend(message); err != nil {
		return err
	}
	return nil
}
