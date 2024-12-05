"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  School as IconCourses,
  Dashboard as IconDashboard,
  Person as IconProfile,
  MenuBook as IconLearning,
  History as IconHistory,
  ShoppingCart as IconShoppingCart,
  Chat as IconChat,
  Logout as IconLogout,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { notifyError, notifySuccess } from "../../utils/ToastNotification";
import { useAppContext } from "../../context/AppContext";

export default function Profile() {
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const open = Boolean(anchorEl2);
  const { setSessionToken } = useAppContext();
  const handleClick2 = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const handleLogout = async () => {
    try {
      setSessionToken(null);
      notifySuccess("Đã đăng xuất thành công!");
      router.push("/logout");
    } catch (error) {
      notifyError("Đã xảy ra lỗi khi đăng xuất.");
    }
  };

  return (
    <Box>
      <IconButton
        aria-expanded={open ? "true" : undefined}
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        sx={{
          padding: 0,
          ...(anchorEl2 && {
            color: "primary.main",
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar src="" alt="E" />
      </IconButton>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "200px",
          },
        }}
      >
        <Link href="/dashboard/" passHref legacyBehavior>
          <MenuItem component="a" onClick={handleClose2}>
            <ListItemIcon>
              <IconDashboard fontSize="small" />
            </ListItemIcon>
            <ListItemText>Bảng điều khiển</ListItemText>
          </MenuItem>
        </Link>
        <Link href="/my-courses" passHref legacyBehavior>
          <MenuItem component="a" onClick={handleClose2}>
            <ListItemIcon>
              <IconCourses fontSize="small" />
            </ListItemIcon>
            <ListItemText>Khóa học của tôi</ListItemText>
          </MenuItem>
        </Link>
        <Link href="/dashboard/" passHref legacyBehavior>
          <MenuItem component="a" onClick={handleClose2}>
            <ListItemIcon>
              <IconDashboard fontSize="small" />
            </ListItemIcon>
            <ListItemText>Bảng điều khiển</ListItemText>
          </MenuItem>
        </Link>

        <Link href="/profile" passHref legacyBehavior>
          <MenuItem component="a" onClick={handleClose2}>
            <ListItemIcon>
              <IconProfile fontSize="small" />
            </ListItemIcon>
            <ListItemText>Hồ sơ cá nhân</ListItemText>
          </MenuItem>
        </Link>

        <Link href="/mylearning" passHref legacyBehavior>
          <MenuItem component="a" onClick={handleClose2}>
            <ListItemIcon>
              <IconLearning fontSize="small" />
            </ListItemIcon>
            <ListItemText>Học tập</ListItemText>
          </MenuItem>
        </Link>

        <Link href="/history" passHref legacyBehavior>
          <MenuItem component="a" onClick={handleClose2}>
            <ListItemIcon>
              <IconHistory fontSize="small" />
            </ListItemIcon>
            <ListItemText>Lịch sử mua hàng</ListItemText>
          </MenuItem>
        </Link>
        <Link href="/chat" passHref legacyBehavior>
          <MenuItem component="a" onClick={handleClose2}>
            <ListItemIcon>
              <IconChat fontSize="small" />
            </ListItemIcon>
            <ListItemText>Trò Chuyện</ListItemText>
          </MenuItem>
        </Link>
        <Box mt={1} py={1} px={2}>
          <Button
            onClick={handleLogout}
            variant="outlined"
            color="primary"
            fullWidth
            startIcon={<IconLogout fontSize="small" />}
          >
            Đăng xuất
          </Button>
        </Box>
      </Menu>
    </Box>
  );
}