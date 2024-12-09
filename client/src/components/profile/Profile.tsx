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
import User from "../../services/User";
import { H5 } from "../Typography";

export default function Profile() {
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const open = Boolean(anchorEl2);
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
    return userProfile?.avt;
  }, [userProfile]);

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
          display: "flex",
          gap: 1,
          alignItems: "center",
          ...(anchorEl2 && {
            color: "primary.main",
          }),
          "&:hover": {
            backgroundColor: "transparent",
            opacity: 0.8,
          },
        }}
        onClick={handleClick2}
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
        <H5 color="white">{userProfile?.full_name || "Tên người dùng"}</H5>
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
            p: "3",
          },
        }}
      >
        <Link href="/dashboard/" passHref legacyBehavior>
          <MenuItem
            component="a"
            onClick={handleClose2}
            sx={{
              "&:hover": {
                backgroundColor: "primary.light",
              },
            }}
          >
            <ListItemIcon>
              <IconDashboard fontSize="small" />
            </ListItemIcon>
            <ListItemText>Bảng điều khiển</ListItemText>
          </MenuItem>
        </Link>
        <Link href="/my-courses" passHref legacyBehavior>
          <MenuItem
            component="a"
            onClick={handleClose2}
            sx={{
              "&:hover": {
                backgroundColor: "primary.light",
              },
            }}
          >
            <ListItemIcon>
              <IconCourses fontSize="small" />
            </ListItemIcon>
            <ListItemText>Khóa học của tôi</ListItemText>
          </MenuItem>
        </Link>
        <Link href="/profile" passHref legacyBehavior>
          <MenuItem
            component="a"
            onClick={handleClose2}
            sx={{
              "&:hover": {
                backgroundColor: "primary.light",
              },
            }}
          >
            <ListItemIcon>
              <IconProfile fontSize="small" />
            </ListItemIcon>
            <ListItemText>Hồ sơ cá nhân</ListItemText>
          </MenuItem>
        </Link>

        <Link href="/mylearning" passHref legacyBehavior>
          <MenuItem
            component="a"
            onClick={handleClose2}
            sx={{
              "&:hover": {
                backgroundColor: "primary.light",
              },
            }}
          >
            <ListItemIcon>
              <IconLearning fontSize="small" />
            </ListItemIcon>
            <ListItemText>Học tập</ListItemText>
          </MenuItem>
        </Link>

        <Link href="/history" passHref legacyBehavior>
          <MenuItem
            component="a"
            onClick={handleClose2}
            sx={{
              "&:hover": {
                backgroundColor: "primary.light",
              },
            }}
          >
            <ListItemIcon>
              <IconHistory fontSize="small" />
            </ListItemIcon>
            <ListItemText>Lịch sử mua hàng</ListItemText>
          </MenuItem>
        </Link>
        <Link href="/chat" passHref legacyBehavior>
          <MenuItem
            component="a"
            onClick={handleClose2}
            sx={{
              "&:hover": {
                backgroundColor: "primary.light",
              },
            }}
          >
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
