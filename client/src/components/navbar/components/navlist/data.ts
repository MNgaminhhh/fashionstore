import categoriesMegaMenu from "./CategoriesMegaMenu";

const megaMenus = [
  [
    {
      title: "Home",
      child: [
        { title: "Technology 1", url: "/tech-1" },
        { title: "Technology 2", url: "/tech-2" },
        { title: "Lifestyle 1", url: "/lifestyle-1" },
        { title: "Lifestyle 2", url: "/lifestyle-2" },
        { title: "Travel 1", url: "/travel-1" },
        { title: "Travel 2", url: "/travel-2" },
        { title: "Entertainment 1", url: "/entertainment-1" },
        { title: "Entertainment 2", url: "/entertainment-2" },
        { title: "Health & Wellness", url: "/health-wellness" },
        { title: "Gadget Store", url: "/gadget-store" },
      ],
    },
  ],

  [
    {
      title: "User Dashboard",
      child: [
        { title: "Order History", url: "/orders" },
        { title: "Account Settings", url: "/account-settings" },
        { title: "View Profile", url: "/profile" },
        { title: "Manage Addresses", url: "/address" },
        { title: "Support Tickets", url: "/support-tickets" },
        { title: "Favorites", url: "/favorites" },
      ],
    },
  ],

  [
    {
      title: "Vendor Services",
      child: [
        { title: "Dashboard", url: "/dashboard" },
        { title: "Product Management", url: "/dashboard/vendor/products" },
        { title: "Order Management", url: "/dashboard/vendor/orders" },
      ],
    },
    {
      title: "Reports",
      child: [
        { title: "Sales Reports", url: "/dashboard/vendor/reports/sales" },
        {
          title: "Inventory Reports",
          url: "/dashboard/vendor/reports/inventory",
        },
      ],
    },
    {
      title: "Authentication",
      child: [
        { title: "Login", url: "/login" },
        { title: "Register", url: "/register" },
      ],
    },
  ],

  [
    {
      title: "Deals",
      child: [
        { title: "Flash Deals", url: "/deals/flash" },
        { title: "Weekly Deals", url: "/deals/weekly" },
      ],
    },
    {
      title: "Shop",
      child: [
        { title: "Electronics", url: "/shop/electronics" },
        { title: "Fashion", url: "/shop/fashion" },
        { title: "Books", url: "/shop/books" },
        { title: "Home & Garden", url: "/shop/home-garden" },
        { title: "Beauty & Health", url: "/shop/beauty-health" },
        { title: "Sports & Outdoors", url: "/shop/sports-outdoors" },
      ],
    },
  ],
];

const navbarNavigation = [
  {
    megaMenu: false,
    megaMenuWithSub: false,
    title: "Trang Chủ",
    url: "/",
  },
  {
    megaMenu: false,
    megaMenuWithSub: false,
    title: "Tất Cả Sản Phẩm",
    url: "/product",
  },
  {
    megaMenu: false,
    megaMenuWithSub: false,
    title: "Các Cửa Hàng",
    url: "public/vendor",
  },
  {
    megaMenu: false,
    megaMenuWithSub: false,
    title: "Trở Thành Nhà Bán Hàng",
    url: "/become-vendor/infor",
  },
  {
    megaMenu: false,
    megaMenuWithSub: false,
    title: "Nhà Bán Hàng",
    child: [
      { title: "Bảng điều khiển", url: "/dashboard/vendor" },
      {
        title: "Sản phẩm",
        child: [
          { title: "Danh sách sản phẩm", url: "/dashboard/vendor/product" },
          { title: "Thêm sản phẩm", url: "/dashboard/vendor/product/create" },
        ],
      },
      { title: "Danh sách đơn hàng", url: "/dashboard/vendor/orders" },
      { title: "Thông tin cửa hàng", url: "/dashboard/vendor/profile" },
    ],
  },
];

export default navbarNavigation;
