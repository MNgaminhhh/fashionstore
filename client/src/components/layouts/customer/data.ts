import Person from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
export const MENUS = [
  {
    title: "BẢNG ĐIỀU KHIỂN",
  },
  {
    title: "CÀI ĐẶT TÀI KHOẢN",
    list: [
      { href: "/profile", title: "Thông tin cá nhân", Icon: Person },
      { href: "/my-address", title: "Địa chỉ của tôi", Icon: HomeIcon },
      { href: "/profiles", title: "Thông tin cá nhâns", Icon: Person },
      { href: "/profiles", title: "Thông tin cá nhâns", Icon: Person },
    ],
  },
];

// export const MENUS = [
//     {
//         title: "BẢNG ĐIỀU KHIỂN",
//     },
//     {
//         title: "CÀI ĐẶT TÀI KHOẢN",
//         list: [
//             { href: "/profile", title: "Thông tin cá nhân", Icon: Person },
//         ]
//     }
// ];
