import Person from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material";
export interface MenuListItem {
  href: string;
  title: string;
  Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & { muiName: string };
  count?: number;
}

export interface MenuItem {
  title: string;
  list: MenuListItem[];
}
export const MENUS = [
  {
    title: "BẢNG ĐIỀU KHIỂN",
    list: [{ href: "/orders", title: "Danh sách đặt hàng", Icon: Person }],
  },
  {
    title: "CÀI ĐẶT TÀI KHOẢN",
    list: [
      { href: "/profile", title: "Thông tin cá nhân", Icon: Person },
      { href: "/my-address", title: "Địa chỉ của tôi", Icon: HomeIcon },
      { href: "/cart", title: "Giỏ hàng của tôi", Icon: HomeIcon },
      { href: "/logout", title: "Đăng xuất", Icon: Person },
    ],
  },
];
