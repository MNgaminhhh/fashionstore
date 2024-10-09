package response

const (
	SuccessCode         = 200
	ErrCodeParamInvalid = 400
	ErrCodeNotFound     = 404
	ErrCodeInternal     = 500
	//========
	ErrCodeEmailNotFound              = 50001
	ErrCodePassword                   = 50002
	ErrCodeUserInactive               = 50003
	ErrCodeUserLocked                 = 50004
	ErrCodeIncorrectConfirmedPassword = 50005
	ErrCodeEmailAlreadyUsed           = 50006
	ErrCodeTokenInvalid               = 50007
)

var msg = map[int]string{
	SuccessCode:         "Successfully",
	ErrCodeParamInvalid: "Thông tin nhập vào không hợp lệ",
	ErrCodeNotFound:     "Resource not found",
	ErrCodeInternal:     "Internal server error",
	//========
	ErrCodeEmailNotFound:              "Email này chưa được đăng ký. Vui Lòng thử lại sau!!",
	ErrCodePassword:                   "Email và mật khẩu chưa chính xác. Vui Lòng thử lại sau!!",
	ErrCodeUserInactive:               "Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt!!",
	ErrCodeUserLocked:                 "Tài khoản đã bị khóa. Liên hệ admin để được hỗ trợ!!",
	ErrCodeIncorrectConfirmedPassword: "Mật khẩu xác nhận không khớp. Vui lòng thử lại!!",
	ErrCodeEmailAlreadyUsed:           "Email này đã được sử dụng!!",
	ErrCodeTokenInvalid:               "Đường dẫn đã hết hạn hoặc không hợp lệ!!",
}
