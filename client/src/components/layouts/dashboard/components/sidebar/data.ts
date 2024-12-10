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
import StoreIcon from "@mui/icons-material/Store";
import ListAltIcon from "@mui/icons-material/ListAlt";
export const navigation = [
  { type: "label", label: "Admin" },
  { name: "Bảng Điều Khiển", icon: DashboardIcon, path: "/dashboard/admin" },
  { type: "label", label: "Ecommerce" },
  {
    name: "Ecommerce",
    icon: ProductsIcon,
    children: [
      { name: "Cấu Hình Vận Chuyển", path: "/dashboard/admin/shipping-rule" },
      { name: "Danh Sách ĐK Mã Giảm Giá", path: "/dashboard/admin/coupons" },
      { name: "Thêm ĐK Mã Giảm Giá", path: "/dashboard/admin/coupons/create" },
      { name: "Danh Sách Mã Giảm Giá", path: "/dashboard/admin/coupons-d" },
      { name: "Thêm Mã Giảm Giá", path: "/dashboard/admin/coupons-d/create" },
    ],
  },
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
      { name: "Duyệt Sản Phẩm", path: "/dashboard/admin/products" },
      {
        name: "Cập Nhật Kiểu Sản Phẩm",
        path: "/dashboard/admin/products-type",
      },
    ],
  },
  {
    name: "Người bán hàng",
    icon: SellerIcon,
    children: [
      { name: "Danh Sách Người Bán", path: "/dashboard/admin/vendors" },
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
    name: "Hoàn Tiền",
    icon: RefundIcon,
    children: [
      { name: "Yêu Cầu Hoàn Tiền", path: "/dashboard/admin/refund-request" },
      { name: "Cài Đặt Hoàn Tiền", path: "/dashboard/admin/refund-setting" },
    ],
  },
  {
    name: "Doanh Thu",
    icon: SellerIcon,
    children: [
      { name: "Lịch Sử Doanh Thu", path: "/dashboard/vendor/earning-history" },
      { name: "Chi trả", path: "/dashboard/vendor/payouts" },
      { name: "Yêu Cầu Chi trả", path: "/dashboard/vendor/payout-requests" },
      { name: "Cài Đặt Chi trả", path: "/dashboard/vendor/payout-settings" },
    ],
  },
  { type: "label", label: "Người Bán" },
  { name: "Tổng quan", icon: DashboardIcon, path: "/dashboard/vendor" },
  {
    name: "Quản lý sản phẩm cửa hàng",
    icon: Inventory2Icon,
    path: "/dashboard/vendor/product",
  },
  {
    name: "Danh sách đơn đặt hàng",
    icon: ListAltIcon,
    path: "/dashboard/vendor/orders",
  },
  {
    name: "Thông tin cửa hàng",
    icon: StoreIcon,
    path: "/dashboard/vendor/profile",
  },
  {
    name: "Đăng Xuất",
    icon: LogoutIcon,
    path: "/",
  },
];
