package response

const (
	SuccessCode         = 200
	ErrCodeParamInvalid = 400
	ErrCodeNotFound     = 404
	ErrCodeInternal     = 500
	//========
	ErrCodeEmailNotFound = 50001
	ErrCodePassword      = 50002
)

var msg = map[int]string{
	SuccessCode:         "Successfully",
	ErrCodeParamInvalid: "Thông tin nhập vào không hợp lệ",
	ErrCodeNotFound:     "Resource not found",
	ErrCodeInternal:     "Internal server error",
	//========
	ErrCodeEmailNotFound: "Email này chưa được đăng ký. Vui Lòng thử lại sau!!",
	ErrCodePassword:      "Email và mật khẩu chưa chính xác. Vui Lòng thử lại sau!!",
}
