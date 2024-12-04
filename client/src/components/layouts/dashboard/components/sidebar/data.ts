import DashboardIcon from "@mui/icons-material/Dashboard";
import ProductsIcon from "@mui/icons-material/Category";
import OrdersIcon from "@mui/icons-material/Receipt";
import CustomersIcon from "@mui/icons-material/People";
import RefundIcon from "@mui/icons-material/MonetizationOn";
import SellerIcon from "@mui/icons-material/Storefront";
import LogoutIcon from "@mui/icons-material/Logout";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import LanguageIcon from "@mui/icons-material/Language";
export const navigationAdmin = [
  { type: "label", label: "Admin" },
  { name: "Bảng Điều Khiển", icon: DashboardIcon, path: "/dashboard/admin" },
  { type: "label", label: "Ecommerce" },
  {
    name: "Quản lý Danh Mục",
    icon: MenuOpenIcon,
    children: [
      { name: "Danh Sách DM", path: "/admin/categories" },
      { name: "Danh Sách DM Con", path: "/admin/categories/sub-category" },
      {
        name: "Danh Sách DM Con Cấp 2",
        path: "/admin/categories/sub-category/child",
      },
    ],
  },
  {
    name: "Quản Lý Sản Phẩm",
    icon: Inventory2Icon,
    children: [
      { name: "Danh Sách Thương Hiệu", path: "/admin/brands" },
      { name: "Thêm Thương Hiệu", path: "/admin/brands/create" },
      { name: "Đánh Giá Sản Phẩm", path: "/admin/products/reviews" },
    ],
  },
  {
    name: "Quản Lý Website",
    icon: LanguageIcon,
    children: [
      { name: "Danh Sách Banner", path: "/dashboard/admin/banners" },
      { name: "Thêm Banner", path: "/dashboard/admin/banners/create" },
      { name: "Đánh Giá Sản Phẩm", path: "/dashboard/admin/banner/reviews" },
    ],
  },
  {
    name: "Sản Phẩm",
    icon: ProductsIcon,
    children: [
      { name: "Danh Sách Sản Phẩm", path: "/admin/products" },
      { name: "Tạo Sản Phẩm", path: "/admin/products/create" },
      { name: "Đánh Giá Sản Phẩm", path: "/admin/products/reviews" },
    ],
  },
  {
    name: "Đơn Hàng",
    icon: OrdersIcon,
    children: [
      { name: "Danh Sách Đơn Hàng", path: "/admin/orders" },
      { name: "Chi Tiết Đơn Hàng", path: "/admin/orders/details" },
    ],
  },

  { name: "Khách Hàng", icon: CustomersIcon, path: "/admin/customers" },
  {
    name: "Hoàn Tiền",
    icon: RefundIcon,
    children: [
      { name: "Yêu Cầu Hoàn Tiền", path: "/admin/refund-request" },
      { name: "Cài Đặt Hoàn Tiền", path: "/admin/refund-setting" },
    ],
  },

  {
    name: "Người bán hàng",
    icon: SellerIcon,
    children: [
      { name: "Danh Sách Người Bán", path: "/admin/vendors" },
      { name: "Lịch Sử Doanh Thu", path: "/admin/earning-history" },
      { name: "Chi trả", path: "/admin/payouts" },
      { name: "Yêu Cầu Chi trả", path: "/admin/payout-requests" },
    ],
  },
  {
    name: "Doanh Thu",
    icon: SellerIcon,
    children: [
      { name: "Lịch Sử Doanh Thu", path: "/vendor/earning-history" },
      { name: "Chi trả", path: "/vendor/payouts" },
      { name: "Yêu Cầu Chi trả", path: "/vendor/payout-requests" },
      { name: "Cài Đặt Chi trả", path: "/vendor/payout-settings" },
    ],
  },

  {
    name: "Yêu Cầu Hoàn Tiền",
    icon: RefundIcon,
    path: "/vendor/refund-request",
  },
  { name: "Đánh Giá", icon: RefundIcon, path: "/vendor/reviews" },
  {
    name: "Cài Đặt Cửa Hàng",
    icon: ProductsIcon,
    path: "/vendor/shop-settings",
  },
  {
    name: "Cài Đặt Tài Khoản",
    icon: ProductsIcon,
    path: "/vendor/account-settings",
  },
  {
    name: "Cài Đặt Trang Web",
    icon: ProductsIcon,
    path: "/vendor/site-settings",
  },
  {
    name: "Đăng Xuất",
    icon: LogoutIcon,
    path: "/",
  },
];

export const navigation = [
  { type: "label", label: "Admin" },
  { name: "Bảng Điều Khiển", icon: DashboardIcon, path: "/dashboard/admin" },
  { type: "label", label: "Ecommerce" },
  {
    name: "Quản lý Danh Mục",
    icon: MenuOpenIcon,
    children: [
      { name: "Danh Sách DM", path: "/dashboard/admin/categories" },
      {
        name: "Danh Sách DM Con",
        path: "/dashboard/admin/categories/sub-category",
      },
      {
        name: "Danh Sách DM Con Cấp 2",
        path: "/dashboard/admin/categories/sub-category/child",
      },
    ],
  },
  {
    name: "Quản Lý Sản Phẩm",
    icon: Inventory2Icon,
    children: [
      { name: "Danh Sách Thương Hiệu", path: "/dashboard/admin/brands" },
      { name: "Thêm Thương Hiệu", path: "/dashboard/admin/brands/create" },
      { name: "Đánh Giá Sản Phẩm", path: "/dashboard/admin/products/reviews" },
    ],
  },
  {
    name: "Quản Lý Website",
    icon: LanguageIcon,
    children: [
      { name: "Flash Sale", path: "/dashboard/admin/flash-sale" },
      { name: "Thêm Flash Sale", path: "/dashboard/admin/flash-sale/create" },
      { name: "Danh Sách Banner", path: "/dashboard/admin/banners" },
      { name: "Thêm Banner", path: "/dashboard/admin/banners/create" },
      { name: "Danh Sách Mã Giảm Giá", path: "/dashboard/admin/coupons" },
      { name: "Thêm Mã Giảm Giá", path: "/dashboard/admin/coupons/create" },
    ],
  },
  {
    name: "Sản Phẩm",
    icon: ProductsIcon,
    children: [
      { name: "Danh Sách Sản Phẩm", path: "/dashboard/admin/products" },
      { name: "Tạo Sản Phẩm", path: "/dashboard/admin/products/create" },
      { name: "Đánh Giá Sản Phẩm", path: "/dashboard/admin/products/reviews" },
    ],
  },
  {
    name: "Đơn Hàng",
    icon: OrdersIcon,
    children: [
      { name: "Danh Sách Đơn Hàng", path: "/dashboard/admin/orders" },
      { name: "Chi Tiết Đơn Hàng", path: "/dashboard/admin/orders/details" },
    ],
  },

  {
    name: "Khách Hàng",
    icon: CustomersIcon,
    path: "/dashboard/admin/customers",
  },
  {
    name: "Hoàn Tiền",
    icon: RefundIcon,
    children: [
      { name: "Yêu Cầu Hoàn Tiền", path: "/dashboard/admin/refund-request" },
      { name: "Cài Đặt Hoàn Tiền", path: "/dashboard/admin/refund-setting" },
    ],
  },

  {
    name: "Người bán hàng",
    icon: SellerIcon,
    children: [
      { name: "Danh Sách Người Bán", path: "/dashboard/admin/vendors" },
      { name: "Lịch Sử Doanh Thu", path: "/dashboard/admin/earning-history" },
      { name: "Chi trả", path: "/dashboard/admin/payouts" },
      { name: "Yêu Cầu Chi trả", path: "/dashboard/admin/payout-requests" },
    ],
  },
  {
    name: "Doanh Thu",
    icon: SellerIcon,
    children: [
      { name: "Lịch Sử Doanh Thu", path: "/vendor/earning-history" },
      { name: "Chi trả", path: "/vendor/payouts" },
      { name: "Yêu Cầu Chi trả", path: "/vendor/payout-requests" },
      { name: "Cài Đặt Chi trả", path: "/vendor/payout-settings" },
    ],
  },

  {
    name: "Yêu Cầu Hoàn Tiền",
    icon: RefundIcon,
    path: "/vendor/refund-request",
  },
  { name: "Đánh Giá", icon: RefundIcon, path: "/vendor/reviews" },
  {
    name: "Cài Đặt Cửa Hàng",
    icon: ProductsIcon,
    path: "/dashboard/vendor/shop-settings",
  },
  {
    name: "Cài Đặt Tài Khoản",
    icon: ProductsIcon,
    path: "/vendor/account-settings",
  },
  {
    name: "Cài Đặt Trang Web",
    icon: ProductsIcon,
    path: "/vendor/site-settings",
  },
  { type: "label", label: "Người Bán" },
  { name: "Tổng quan", icon: DashboardIcon, path: "/dashboard/vendor" },
  {
    name: "Quản lý sản phẩm",
    icon: DashboardIcon,
    path: "/dashboard/vendor/product",
  },
  {
    name: "Đăng Xuất",
    icon: LogoutIcon,
    path: "/",
  },
];
