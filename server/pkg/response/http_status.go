package response

const (
	SuccessCode         = 200
	ErrCodeParamInvalid = 400
	ErrCodeNotFound     = 404
	ErrCodeInternal     = 500
	ErrCodeUnauthorized = 401
	ErrCodeValidate     = 422
	ErrCodeConflict     = 409
	ErrCodeForeignKey   = 40301
	ErrCodeDatabase     = 55001
	ErrCodeUnknown      = 520
	ErrCodeNoContent    = 521
	//========
	ErrCodeEmailNotFound                = 50001
	ErrCodeIncorrectPassword            = 50002
	ErrCodeUserInactive                 = 50003
	ErrCodeUserLocked                   = 50004
	ErrCodeIncorrectConfirmedPassword   = 50005
	ErrCodeEmailAlreadyUsed             = 50006
	ErrCodeTokenInvalid                 = 50007
	ErrCodeCannotVerifyThisEmail        = 50009
	ErrCodeUserNotFound                 = 50010
	ErrCodeInvalidRole                  = 50011
	ErrPhoneNumberAlreadyUsed           = 50012
	ErrCodeIncorrectDateFormat          = 50013
	ErrCodeCannotUploadFile             = 50014
	ErrCodeBrandNotFound                = 50015
	ErrCodeNameCodeAlreadyUsed          = 50016
	ErrCodeNameAlreadyUsed              = 50017
	ErrCodeCateNotFound                 = 50018
	ErrCodeSubCateNotFound              = 50019
	ErrCodeVendorNotFound               = 50020
	ErrCodeCateParentNotFound           = 50021
	ErrCodeBannerNotFound               = 50022
	ErrCodeProductNotFound              = 50023
	ErrCodeProductVariantNotFound       = 50024
	ErrCodeCombinationOptionsIsExists   = 50025
	ErrCodeInvalidDateTimeFormat        = 50026
	ErrCodeInvalidEndDate               = 50027
	ErrCodeInvalidFlashSaleStartDate    = 50028
	ErrCodeInStock                      = 50029
	ErrCodeInStockCheck                 = 50030
	ErrCodeEndDateEmpty                 = 50031
	ErrCodeDiscountFixedType            = 50032
	ErrCodeValueDiscountPercentage      = 50033
	ErrCodeCouponIsAlreadyExist         = 50034
	ErrCodeConstraintDeleteCondition    = 50035
	ErrCodeInactiveCouponAfterStartDate = 50036
	ErrCodeCouponsAreUsing              = 50037
	ErrCodeShippingCost                 = 50038
	ErrCodeUniqueMinOrderCost           = 50039
	ErrCodeNoPermissionReview           = 50040
	ErrCodeAlreadyReviewed              = 50041
	ErrCodeInvalidRatingPoint           = 50042
	ErrCodeDateIsRequired               = 50043
	ErrCodeInvalidSku                   = 50044
	ErrCodeInvalidCoupon                = 50045
	ErrCodeInvalidCouponType            = 50046
	ErrCodeInvalidSkuStatus             = 50047
	ErrCodeCouponAlreadyUsed            = 50048
	ErrCodeOrderBillNotEqualMinCost     = 50049
	ErrCodeShippingFeeIsRequired        = 50050
	ErrCodeMinOrderCostIsRequired       = 50051
	ErrCodeInvalidStatus                = 50052
	ErrCodeUserNotPaying                = 50053
	ErrCodeInvalidPayingMethod          = 50054
	ErrCodeInvalidOrderStatus           = 50055
	ErrCodeForbidden                    = 403
)

var msg = map[int]string{
	SuccessCode:         "Thành công",
	ErrCodeParamInvalid: "Thông tin nhập vào không hợp lệ",
	ErrCodeNotFound:     "Không tìm thấy",
	ErrCodeInternal:     "Lỗi hệ thống. Vui lòng thử lại sau",
	//========
	ErrCodeEmailNotFound:                "Email này chưa được đăng ký. Vui lòng thử lại sau!!",
	ErrCodeIncorrectPassword:            "Tài khoản hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!!",
	ErrCodeUserInactive:                 "Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt!!",
	ErrCodeUserLocked:                   "Tài khoản đã bị khóa. Liên hệ admin để được hỗ trợ!!",
	ErrCodeIncorrectConfirmedPassword:   "Mật khẩu xác nhận không khớp. Vui lòng thử lại!!",
	ErrCodeEmailAlreadyUsed:             "Email này đã được sử dụng!!",
	ErrCodeTokenInvalid:                 "Đường dẫn đã hết hạn hoặc không hợp lệ!!",
	ErrCodeUnauthorized:                 "Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại !!",
	ErrCodeCannotVerifyThisEmail:        "Không thể gửi email xác thực. Vui lòng thử lại sau!!",
	ErrCodeUserNotFound:                 "Không tìm thấy thông tin người dùng",
	ErrCodeInvalidRole:                  "Người dùng hiện tại không có quyền thực hiện hành động này!!",
	ErrPhoneNumberAlreadyUsed:           "Số điện thoại này đã được sử dụng!!",
	ErrCodeIncorrectDateFormat:          "Vui lòng nhập đúng định dạng ngày dd-mm-yyyy",
	ErrCodeCannotUploadFile:             "Không thể tải file lên hệ thống. Vui lòng thử lại!!",
	ErrCodeBrandNotFound:                "Brand này không tồn tại. Vui lòng kiểm tra lại!!",
	ErrCodeNameCodeAlreadyUsed:          "Name code này đã được sử dụng rồi!!",
	ErrCodeNameAlreadyUsed:              "Loại này đã tồn tại!!",
	ErrCodeCateNotFound:                 "Không thể xóa danh mục vì danh mục không tồn tại hoặc đang được liên kết với dữ liệu khác. Vui lòng kiểm tra và thử lại!",
	ErrCodeSubCateNotFound:              "Không thể xóa danh mục con vì danh mục con không tồn tại hoặc đang được liên kết với dữ liệu khác. Vui lòng kiểm tra và thử lại!",
	ErrCodeVendorNotFound:               "Không tìm thấy người bán!!",
	ErrCodeCateParentNotFound:           "Không tìm thấy parent category!",
	ErrCodeBannerNotFound:               "Không tìm tấy banner!!",
	ErrCodeForbidden:                    "Bạn không có quyền thực hiện hành động này. Vui lòng thử lại sau!",
	ErrCodeProductNotFound:              "Không tìm thấy sản phẩm nào. Vui lòng thử lại sau!",
	ErrCodeValidate:                     "Một vài dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin!",
	ErrCodeConflict:                     "Một vài dữ liệu đã tồn tại. Vui lòng kiểm tra lại!",
	ErrCodeForeignKey:                   "Một vài dữ liệu tham chiếu không hợp lệ. Vui lòng kiểm tra lại!",
	ErrCodeDatabase:                     "Đã xảy ra lỗi trong cơ sở dữ liệu. Vui lòng thử lại sau!",
	ErrCodeUnknown:                      "Đã xảy ra lỗi không xác định. Vui lòng thử lại sau!",
	ErrCodeProductVariantNotFound:       "Không tìm thấy dữ liệu!",
	ErrCodeCombinationOptionsIsExists:   "Loại hàng hóa này đã tồn tại. Vui lòng kiểm tra lại!",
	ErrCodeInvalidDateTimeFormat:        "Định dạng phải là dd-MM-yyyy hh:mm",
	ErrCodeInvalidEndDate:               "Ngày kết thúc phải sau ngày bắt đầu!",
	ErrCodeInvalidFlashSaleStartDate:    "Ngày bắt đầu phải lớn hơn ngày hiện tại!",
	ErrCodeNoContent:                    "Không tìm thấy đối tượng!",
	ErrCodeInStock:                      "Số lượng hàng hóa vẫn còn trong kho!",
	ErrCodeInStockCheck:                 "Số lượng sản phẩm không thể nhỏ hơn 0!",
	ErrCodeEndDateEmpty:                 "Vui lòng nhập ngày kết thúc!",
	ErrCodeDiscountFixedType:            "Giá tiền giảm tối đa không thể khác với giá tiền giảm với loại mã cố định!",
	ErrCodeValueDiscountPercentage:      "Giá trị trong khoảng từ 1-100!",
	ErrCodeCouponIsAlreadyExist:         "Mã code coupon đã tồn tại!",
	ErrCodeConstraintDeleteCondition:    "Không thể xóa điều kiện này vì đang được sử dụng ở coupon!",
	ErrCodeInactiveCouponAfterStartDate: "Không thể chuyển trạng thái vì đã đến ngày có thể sử dụng mã!",
	ErrCodeCouponsAreUsing:              "Không thể cập nhật mã giảm trong thời gian sử dụng!",
	ErrCodeShippingCost:                 "Giá tiền mà giá trị đơn nhỏ nhất phải là bôi số của 100",
	ErrCodeUniqueMinOrderCost:           "Giá trị tối thiểu đơn hàng này đã tồn tại!",
	ErrCodeNoPermissionReview:           "Bạn không có quyền đánh giá sản phẩm này",
	ErrCodeAlreadyReviewed:              "Bạn đã đánh giá cho sản phẩm này rồi!",
	ErrCodeInvalidRatingPoint:           "Điểm đánh giá phải nằm trong khoảng từ 0 đến 5 và là bội số của 0.5",
	ErrCodeDateIsRequired:               "Ngày bắt đầu và ngày kết thúc không được để trống!",
	ErrCodeInvalidSku:                   "Sản phẩm bạn mua có thể đã hết số lượng hoặc đã ngưng bán!",
	ErrCodeInvalidCoupon:                "Mã giảm giá đã hết lượt sử dụng hoặc hết hạn!",
	ErrCodeInvalidCouponType:            "Áp dụng sai loại mã giảm giá!",
	ErrCodeInvalidSkuStatus:             "Status phải là active hoặc inactive",
	ErrCodeCouponAlreadyUsed:            "Mã giảm giá đã được sử dụng",
	ErrCodeOrderBillNotEqualMinCost:     "Đơn hàng chưa đạt giá trị tối thiểu để sử dụng mã giảm gía",
	ErrCodeShippingFeeIsRequired:        "Price là bắt buộc!",
	ErrCodeMinOrderCostIsRequired:       "MinOrderCost là bắt buộc!",
	ErrCodeInvalidStatus:                "Trạng thái mới không phù hợp với trạng thái hiện tại!",
	ErrCodeUserNotPaying:                "Người dùng chưa thanh toán với phương thức QR Pay!",
	ErrCodeInvalidPayingMethod:          "PayingMethod phải là COD hoặc QR_CODE",
	ErrCodeInvalidOrderStatus:           "OrderStatus phải là paying pending shipping delivered cancel",
}
