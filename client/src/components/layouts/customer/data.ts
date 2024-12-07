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
