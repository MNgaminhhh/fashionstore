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
        { title: "Dashboard", url: "/vendor/dashboard" },
        { title: "Product Management", url: "/vendor/products" },
        { title: "Order Management", url: "/vendor/orders" },
      ],
    },
    {
      title: "Reports",
      child: [
        { title: "Sales Reports", url: "/vendor/reports/sales" },
        { title: "Inventory Reports", url: "/vendor/reports/inventory" },
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
    megaMenu: true,
    megaMenuWithSub: false,
    title: "Mega Menu",
    child: [
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
            { title: "Dashboard", url: "/vendor/dashboard" },
            { title: "Product Management", url: "/vendor/products" },
            { title: "Order Management", url: "/vendor/orders" },
          ],
        },
        {
          title: "Reports",
          child: [
            { title: "Sales Reports", url: "/vendor/reports/sales" },
            { title: "Inventory Reports", url: "/vendor/reports/inventory" },
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
    ],
  },
  {
    megaMenu: false,
    megaMenuWithSub: true,
    title: "Full Screen Menu",
    child: categoriesMegaMenu,
  },
  {
    megaMenu: false,
    megaMenuWithSub: false,
    title: "User Account",
    child: [
      { title: "Hồ Sơ Thông Tin", url: "/profile" },
      { title: "Cài Đặt", url: "/settings" },
    ],
  },
  {
    megaMenu: false,
    megaMenuWithSub: false,
    title: "Nhà Bán Hàng",
    url: "public/vendor",
  },
  {
    megaMenu: false,
    megaMenuWithSub: false,
    title: "Vendor Account",
    child: [
      { title: "Dashboard", url: "/vendor/dashboard" },
      {
        title: "Products",
        child: [
          { title: "Product List", url: "/vendor/products" },
          { title: "Add Product", url: "/vendor/products/add" },
        ],
      },
      {
        title: "Orders",
        child: [
          { title: "Order List", url: "/vendor/orders" },
          { title: "Order Details", url: "/vendor/orders/order-123" },
        ],
      },
      { title: "Settings", url: "/vendor/settings" },
    ],
  },
];

export default navbarNavigation;
