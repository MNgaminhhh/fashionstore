const navbarNavigation = [
  {
    megaMenu: false,
    megaMenuWithSub: false,
    title: "Trang Chủ",
    url: "/",
    allowedRoles: ["customer", "vendors", "admin"],
  },
  {
    megaMenu: false,
    megaMenuWithSub: false,
    title: "Tất Cả Sản Phẩm",
    url: "/product",
    allowedRoles: ["customer", "vendors", "admin"],
  },
  {
    megaMenu: false,
    megaMenuWithSub: false,
    title: "Các Cửa Hàng",
    url: "public/vendor",
    allowedRoles: ["customer", "vendors", "admin"],
  },
  {
    megaMenu: false,
    megaMenuWithSub: false,
    title: "Trở Thành Nhà Bán Hàng",
    url: "/become-vendor/infor",
    allowedRoles: ["customer"],
  },
  {
    megaMenu: false,
    megaMenuWithSub: false,
    title: "Nhà Bán Hàng",
    allowedRoles: ["vendors"],
    child: [
      {
        title: "Bảng điều khiển",
        url: "/dashboard/vendor",
        allowedRoles: ["vendors"],
      },
      {
        title: "Sản phẩm",
        allowedRoles: ["vendors"],
        child: [
          {
            title: "Danh sách sản phẩm",
            url: "/dashboard/vendor/product",
            allowedRoles: ["vendors"],
          },
          {
            title: "Thêm sản phẩm",
            url: "/dashboard/vendor/product/create",
            allowedRoles: ["vendors"],
          },
        ],
      },
      {
        title: "Danh sách đơn hàng",
        url: "/dashboard/vendor/orders",
        allowedRoles: ["vendors"],
      },
      {
        title: "Thông tin cửa hàng",
        url: "/dashboard/vendor/profile",
        allowedRoles: ["vendors"],
      },
    ],
  },
  {
    megaMenu: false,
    megaMenuWithSub: false,
    title: "Admin",
    allowedRoles: ["admin"],
    child: [
      {
        title: "Bảng điều khiển",
        url: "/dashboard/admin",
        allowedRoles: ["admin"],
      },
      {
        title: "Ecommerce",
        allowedRoles: ["admin"],
        child: [
          {
            title: "Cấu hình vận chuyển",
            url: "/dashboard/admin/shipping-rule",
            allowedRoles: ["admin"],
          },
          {
            title: "Danh sách ĐK mã giảm giá",
            url: "/dashboard/admin/coupons",
            allowedRoles: ["admin"],
          },
          {
            title: "Danh sách mã giảm giá",
            url: "/dashboard/admin/coupons-d",
            allowedRoles: ["admin"],
          },
        ],
      },
      {
        title: "Quản Lý danh mục",
        allowedRoles: ["admin"],
        child: [
          {
            title: "Danh sách danh mục",
            url: "/dashboard/admin/categories",
            allowedRoles: ["admin"],
          },
          {
            title: "Danh sách danh mục con",
            url: "/dashboard/admin/categories/sub-category",
            allowedRoles: ["admin"],
          },
          {
            title: "Danh sách danh mục con C2",
            url: "/dashboard/admin/categories/sub-category/child",
            allowedRoles: ["admin"],
          },
        ],
      },
      {
        title: "Quản lý sản phẩm",
        allowedRoles: ["admin"],
        child: [
          {
            title: "Danh sách thương hiệu",
            url: "/dashboard/admin/brands",
            allowedRoles: ["admin"],
          },
          {
            title: "Duyệt sản phẩm",
            url: "/dashboard/admin/products",
            allowedRoles: ["admin"],
          },
          {
            title: "Kiểu sản phẩm",
            url: "/dashboard/admin/products-type",
            allowedRoles: ["admin"],
          },
        ],
      },
      {
        title: "Danh sách người bán hàng",
        url: "/dashboard/admin/vendors",
        allowedRoles: ["admin"],
      },
      {
        title: "Danh sách đơn hàng",
        url: "/dashboard/admin/orders",
        allowedRoles: ["admin"],
      },
    ],
  },
];

export default navbarNavigation;
