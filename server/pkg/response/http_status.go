package response

const (
	SuccessCode         = 200
	ErrCodeParamInvalid = 400
	ErrCodeNotFound     = 404
	ErrCodeInternal     = 500
	//========
	ErrCodeEmailNotFound              = 50001
	ErrCodeIncorrectPassword          = 50002
	ErrCodeUserInactive               = 50003
	ErrCodeUserLocked                 = 50004
	ErrCodeIncorrectConfirmedPassword = 50005
	ErrCodeEmailAlreadyUsed           = 50006
	ErrCodeTokenInvalid               = 50007
	ErrCodeUnauthorized               = 50008
	ErrCodeCannotVerifyThisEmail      = 50009
)

var msg = map[int]string{
	SuccessCode:         "Thành công",
	ErrCodeParamInvalid: "Thông tin nhập vào không hợp lệ",
	ErrCodeNotFound:     "Không tìm thấy",
	ErrCodeInternal:     "Lỗi hệ thống",
	//========
	ErrCodeEmailNotFound:              "Email này chưa được đăng ký. Vui lòng thử lại sau!!",
	ErrCodeIncorrectPassword:          "Mật khẩu không chính xác. Vui lòng kiểm tra lại!!",
	ErrCodeUserInactive:               "Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt!!",
	ErrCodeUserLocked:                 "Tài khoản đã bị khóa. Liên hệ admin để được hỗ trợ!!",
	ErrCodeIncorrectConfirmedPassword: "Mật khẩu xác nhận không khớp. Vui lòng thử lại!!",
	ErrCodeEmailAlreadyUsed:           "Email này đã được sử dụng!!",
	ErrCodeTokenInvalid:               "Đường dẫn đã hết hạn hoặc không hợp lệ!!",
	ErrCodeUnauthorized:               "Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại !!",
	ErrCodeCannotVerifyThisEmail:      "Không thể gửi email xác thực. Vui lòng thử lại sau!!",
}
