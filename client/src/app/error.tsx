"use client";

import React from "react";
import { Card, Button, Box } from "@mui/material";
import { H1, H6 } from "../components/Typography";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface Props {
  reset: () => void;
  error: Error & { digest?: string };
}

export default function Error({ error, reset }: Props) {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        bgcolor: "grey.100",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card
        sx={{
          p: 4,
          textAlign: "center",
          maxWidth: 400,
          width: "100%",
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "#fff",
        }}
      >
        <Box mb={2} display="flex" justifyContent="center">
          <ErrorOutlineIcon sx={{ fontSize: 50, color: "error.main" }} />
        </Box>
        <H1 mb={2} color="text.primary" fontWeight={700}>
          Đã xảy ra sự cố!
        </H1>
        <H6 mb={3} color="text.secondary">
          Rất tiếc, chúng tôi đã gặp lỗi khi tải trang. Vui lòng thử lại!
        </H6>
        <Button
          color="primary"
          variant="contained"
          onClick={() => reset()}
          sx={{ px: 4, py: 1.2, fontWeight: 600 }}
        >
          Thử lại
        </Button>
      </Card>
    </Box>
  );
}
