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

export default function LogoutView() {
  const [timer, setTimer] = useState(3);
  const router = useRouter();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      router.push("/login");
    }
  }, [timer, router]);

  const handleRedirect = () => {
    router.push("/login");
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
        sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          Đang đăng xuất tài khoản...
        </Typography>
        <Typography variant="body1" sx={{ marginTop: 1 }}>
          Bạn sẽ được chuyển hướng sau {timer} giây.
        </Typography>
        <Button
          variant="contained"
          sx={{ marginTop: 2 }}
          onClick={handleRedirect}
        >
          Quay lại trang đăng nhập ngay
        </Button>
      </Box>
    </Container>
  );
}
