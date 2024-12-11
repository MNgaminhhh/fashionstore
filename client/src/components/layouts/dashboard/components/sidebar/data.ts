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
  { type: "label", label: "Admin", allowedRoles: ["admin"] },
  {
    name: "Bảng Điều Khiển",
    icon: DashboardIcon,
    path: "/dashboard/admin",
    allowedRoles: ["admin"],
  },
  { type: "label", label: "Ecommerce", allowedRoles: ["admin"] },
  {
    name: "Ecommerce",
    icon: ProductsIcon,
    allowedRoles: ["admin"],
    children: [
      {
        name: "Cấu Hình Vận Chuyển",
        path: "/dashboard/admin/shipping-rule",
        allowedRoles: ["admin"],
      },
      {
        name: "Danh Sách ĐK Mã Giảm Giá",
        path: "/dashboard/admin/coupons",
        allowedRoles: ["admin"],
      },
      {
        name: "Thêm ĐK Mã Giảm Giá",
        path: "/dashboard/admin/coupons/create",
        allowedRoles: ["admin"],
      },
      {
        name: "Danh Sách Mã Giảm Giá",
        path: "/dashboard/admin/coupons-d",
        allowedRoles: ["admin"],
      },
      {
        name: "Thêm Mã Giảm Giá",
        path: "/dashboard/admin/coupons-d/create",
        allowedRoles: ["admin"],
      },
    ],
  },
  {
    name: "Quản lý Danh Mục",
    icon: MenuOpenIcon,
    allowedRoles: ["admin"],
    children: [
      {
        name: "Danh Sách DM",
        path: "/dashboard/admin/categories",
        allowedRoles: ["admin"],
      },
      {
        name: "Danh Sách DM Con",
        path: "/dashboard/admin/categories/sub-category",
        allowedRoles: ["admin"],
      },
      {
        name: "Danh Sách DM Con Cấp 2",
        path: "/dashboard/admin/categories/sub-category/child",
        allowedRoles: ["admin"],
      },
    ],
  },
  {
    name: "Quản Lý Sản Phẩm",
    icon: Inventory2Icon,
    allowedRoles: ["admin"],
    children: [
      {
        name: "Danh Sách Thương Hiệu",
        path: "/dashboard/admin/brands",
        allowedRoles: ["admin"],
      },
      {
        name: "Thêm Thương Hiệu",
        path: "/dashboard/admin/brands/create",
        allowedRoles: ["admin"],
      },
      {
        name: "Duyệt Sản Phẩm",
        path: "/dashboard/admin/products",
        allowedRoles: ["admin"],
      },
      {
        name: "Cập Nhật Kiểu Sản Phẩm",
        path: "/dashboard/admin/products-type",
        allowedRoles: ["admin"],
      },
    ],
  },
  {
    name: "Người bán hàng",
    icon: SellerIcon,
    allowedRoles: ["admin"],
    children: [
      {
        name: "Danh Sách Người Bán",
        path: "/dashboard/admin/vendors",
        allowedRoles: ["admin"],
      },
    ],
  },
  {
    name: "Quản Lý Website",
    icon: LanguageIcon,
    allowedRoles: ["admin"],
    children: [
      {
        name: "Flash Sale",
        path: "/dashboard/admin/flash-sale",
        allowedRoles: ["admin"],
      },
      {
        name: "Thêm Flash Sale",
        path: "/dashboard/admin/flash-sale/create",
        allowedRoles: ["admin"],
      },
      {
        name: "Danh Sách Banner",
        path: "/dashboard/admin/banners",
        allowedRoles: ["admin"],
      },
      {
        name: "Thêm Banner",
        path: "/dashboard/admin/banners/create",
        allowedRoles: ["admin"],
      },
    ],
  },
  {
    name: "Đơn Hàng",
    icon: OrdersIcon,
    allowedRoles: ["admin"],
    children: [
      {
        name: "Danh Sách Đơn Hàng",
        path: "/dashboard/admin/orders",
        allowedRoles: ["admin"],
      },
    ],
  },
  { type: "label", label: "Người Bán", allowedRoles: ["vendors"] },
  {
    name: "Tổng quan",
    icon: DashboardIcon,
    path: "/dashboard/vendor",
    allowedRoles: ["vendors"],
  },
  {
    name: "Quản lý sản phẩm cửa hàng",
    icon: Inventory2Icon,
    path: "/dashboard/vendor/product",
    allowedRoles: ["vendors"],
  },
  {
    name: "Danh sách đơn đặt hàng",
    icon: ListAltIcon,
    path: "/dashboard/vendor/orders",
    allowedRoles: ["vendors"],
  },
  {
    name: "Thông tin cửa hàng",
    icon: StoreIcon,
    path: "/dashboard/vendor/profile",
    allowedRoles: ["vendors"],
  },
  {
    name: "Đăng Xuất",
    icon: LogoutIcon,
    path: "/logout",
    allowedRoles: ["admin", "vendors"],
  },
];

export default navigation;
