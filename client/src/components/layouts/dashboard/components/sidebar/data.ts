import DashboardIcon from "@mui/icons-material/Dashboard";
import ProductsIcon from "@mui/icons-material/Category";
import OrdersIcon from "@mui/icons-material/Receipt";
import CustomersIcon from "@mui/icons-material/People";
import RefundIcon from "@mui/icons-material/MonetizationOn";
import SellerIcon from "@mui/icons-material/Storefront";
import LogoutIcon from "@mui/icons-material/Logout";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
export const navigationAdmin = [
  { type: "label", label: "Admin" },
  { name: "Bảng Điều Khiển", icon: DashboardIcon, path: "/admin/dashboard" },
  { type: "label", label: "Ecommerce" },
  {
    name: "Quản Lý Danh Mục",
    icon: MenuOpenIcon,
    children: [
      { name: "Danh Sách Danh Mục", path: "/categories/brands" },
      { name: "Danh Sách Danh Mục Con", path: "/categories/brands/create" },
      {
        name: "Danh Sách Danh Mục Con Cấp 2",
        path: "/categories/products/reviews",
      },
    ],
  },
  {
    name: "Quản lý Sản phẩm",
    icon: Inventory2Icon,
    children: [
      { name: "Danh Sách Thương Hiệu", path: "/admin/brands" },
      { name: "Thêm Thương Hiệu", path: "/admin/brands/create" },
      { name: "Đánh Giá Sản Phẩm", path: "/admin/products/reviews" },
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
    name: "Danh Mục",
    icon: ProductsIcon,
    children: [
      { name: "Danh Sách Danh Mục", path: "/admin/categories" },
      { name: "Tạo Danh Mục", path: "/admin/categories/create" },
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
  { type: "label", label: "Người Bán" },
  { name: "Tổng quan", icon: DashboardIcon, path: "/vendor/dashboard" },
  {
    name: "Đăng Xuất",
    icon: LogoutIcon,
    path: "/",
  },
];
