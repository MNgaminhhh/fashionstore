package response

const (
	SuccessCode         = 200
	ErrCodeParamInvalid = 400
	ErrCodeNotFound     = 404
	ErrCodeInternal     = 500
	//========
	ErrCodeEmailNotFound = 50001
	ErrCodePassword      = 50002
	ErrCodeUserInactive  = 50003
	ErrCodeUserLocked    = 50004
)

var msg = map[int]string{
	SuccessCode:         "Successfully",
	ErrCodeParamInvalid: "Invalid parameters provided",
	ErrCodeNotFound:     "Resource not found",
	ErrCodeInternal:     "Internal server error",
	//========
	ErrCodeEmailNotFound: "Email này chưa được đăng ký. Vui Lòng thử lại sau!!",
	ErrCodePassword:      "Email và mật khẩu chưa chính xác. Vui Lòng thử lại sau!!",
	ErrCodeUserInactive:  "Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt!!",
	ErrCodeUserLocked:    "Tài khoản đã bị khóa. Liên hệ admin để được hỗ trợ!!",
}
