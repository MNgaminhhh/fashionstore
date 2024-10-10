package service

import (
	gomail "gopkg.in/mail.v2"
)

type IEmailService interface {
	SendEmail(subject, content, receiver string) error
}

type SMTPServer struct {
	Host     string
	Port     int
	Username string
	Password string
}

type EmailService struct {
	SMTPServer *SMTPServer
}

func NewEmailService(smtpServer SMTPServer) IEmailService {
	return &EmailService{
		SMTPServer: &smtpServer,
	}
}

func (es EmailService) SendEmail(subject string, content string, receiver string) error {
	message := gomail.NewMessage()
	message.SetHeader("From", es.SMTPServer.Username)
	message.SetHeader("To", receiver)
	message.SetHeader("Subject", subject)
	message.AddAlternative("text/html", content)

	smtpServer := es.SMTPServer
	dialer := gomail.NewDialer(smtpServer.Host, smtpServer.Port, smtpServer.Username, smtpServer.Password)

	if err := dialer.DialAndSend(message); err != nil {
		return err
	}
	return nil
}
