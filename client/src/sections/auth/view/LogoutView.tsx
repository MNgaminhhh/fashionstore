"use client";

import {
  Box,
  CircularProgress,
  Container,
  Typography,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Auth from "../../../services/Auth";
import { useAppContext } from "../../../context/AppContext";

export default function LogoutView() {
  const [timer, setTimer] = useState(3);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setSessionToken, setCart } = useAppContext();
  useEffect(() => {
    const performLogout = async () => {
      try {
        await Auth.logout();
      } catch (err) {
        console.error("Error during logout:", err);
        setError("Đã xảy ra lỗi khi đăng xuất. Vui lòng thử lại.");
      }
    };

    performLogout();
  }, []);

  useEffect(() => {
    if (timer <= 0) {
      setSessionToken(null);
      setCart(null);
      router.push("/login");
      router.refresh();
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, router]);

  const handleRedirect = () => {
    router.push("/login");
    router.refresh();
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          Đang đăng xuất tài khoản...
        </Typography>
        {error ? (
          <Typography variant="body1" color="error" sx={{ marginTop: 1 }}>
            {error}
          </Typography>
        ) : (
          <Typography variant="body1" sx={{ marginTop: 1 }}>
            Bạn sẽ được chuyển hướng sau {timer} giây.
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
          onClick={handleRedirect}
        >
          Quay lại trang đăng nhập ngay
        </Button>
      </Box>
    </Container>
  );
}
