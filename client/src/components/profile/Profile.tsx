"use client";
import React, { useState, useEffect, useMemo } from "react";
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
  Divider,
} from "@mui/material";
import {
  Person as IconProfile,
  ShoppingCart as IconShoppingCart,
  History as IconHistory,
  Logout as IconLogout,
  Dashboard as IconDashboard,
  Home as IconHome,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { notifyError, notifySuccess } from "../../utils/ToastNotification";
import { useAppContext } from "../../context/AppContext";
import User from "../../services/User";
import { H5 } from "../Typography";

export default function Profile() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const open = Boolean(anchorEl);
  const { setSessionToken, sessionToken } = useAppContext();

  const fetchUserProfile = async (token: string) => {
    setLoading(true);
    try {
      const response = await User.profile(token);
      setUserProfile(response.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      notifyError("Lỗi lấy thông tin tài khoản");
    }
  };

  useEffect(() => {
    if (sessionToken) {
      fetchUserProfile(sessionToken);
    }
  }, [sessionToken]);

  const avatarSrc = useMemo(() => {
    return userProfile?.avt || "/default-avatar.png";
  }, [userProfile]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      router.push("/logout");
      router.refresh();
    } catch (error) {
      notifyError("Đã xảy ra lỗi khi đăng xuất.");
    }
  };

  return (
    <Box>
      <IconButton
        aria-expanded={open ? "true" : undefined}
        aria-controls={open ? "profile-menu" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        sx={{
          padding: 0,
          display: "flex",
          gap: 1,
          alignItems: "center",
          "&:hover": {
            backgroundColor: "transparent",
            opacity: 0.8,
          },
        }}
      >
        <Box sx={{ position: "relative", width: "48px", height: "48px" }}>
          <Avatar
            src={avatarSrc}
            alt="User Avatar"
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
            }}
          />
        </Box>
        <H5 color="white" fontWeight={600}>
          {userProfile?.full_name || "Tên người dùng"}
        </H5>
      </IconButton>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          marginTop: "8px",
          "& .MuiMenu-paper": {
            width: "220px",
            padding: "8px",
          },
        }}
      >
        <Link href="/profile" passHref>
          <MenuItem
            component="a"
            onClick={handleClose}
            sx={{ "&:hover": { backgroundColor: "primary.light" } }}
          >
            <ListItemIcon>
              <IconProfile fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Thông tin cá nhân" />
          </MenuItem>
        </Link>

        <Divider sx={{ my: 1 }} />
        <Link href="/orders" passHref>
          <MenuItem
            component="a"
            onClick={handleClose}
            sx={{ "&:hover": { backgroundColor: "primary.light" } }}
          >
            <ListItemIcon>
              <IconHistory fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Lịch sử đơn hàng" />
          </MenuItem>
        </Link>
        <Link href="/cart" passHref>
          <MenuItem
            component="a"
            onClick={handleClose}
            sx={{ "&:hover": { backgroundColor: "primary.light" } }}
          >
            <ListItemIcon>
              <IconShoppingCart fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Giỏ hàng của tôi" />
          </MenuItem>
        </Link>

        <Link href="/my-address" passHref>
          <MenuItem
            component="a"
            onClick={handleClose}
            sx={{ "&:hover": { backgroundColor: "primary.light" } }}
          >
            <ListItemIcon>
              <IconHome fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Địa chỉ của tôi" />
          </MenuItem>
        </Link>

        <Divider sx={{ my: 1 }} />

        <Box mt={1} py={1} px={2}>
          <Button
            onClick={handleLogout}
            variant="outlined"
            color="primary"
            fullWidth
            startIcon={<IconLogout fontSize="small" />}
            sx={{
              "&:hover": {
                backgroundColor: "primary.light",
              },
            }}
          >
            Đăng xuất
          </Button>
        </Box>
      </Menu>
    </Box>
  );
}
