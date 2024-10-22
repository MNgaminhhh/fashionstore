import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";

export const navigation = [
    { type: "label", label: "Người Bán" },
    { name: "Tổng quan", icon: DashboardIcon, path: "/vendor/dashboard" },
    {
        name: "Đăng Xuất",
        icon: LogoutIcon,
        path: "/"
    }
];
