"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
} from "@mui/material";
import { notifyError, notifySuccess } from "../../../utils/ToastNotification";
import Cart from "../../../services/Cart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";

export default function CancelPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderCode = searchParams.get("orderCode");
  const status = searchParams.get("status");
  const cancel = searchParams.get("cancel");

  const [message, setMessage] = useState<string>("Đang hủy đơn hàng...");
  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    async function cancelOrder() {
      if (cancel === "true" && orderCode && status === "CANCELLED") {
        try {
          const res = await Cart.cancelOrder(orderCode);
          if (res?.success || res?.data?.success) {
            notifySuccess("Hủy đơn hàng thành công!");
            setMessage(`Đơn hàng ${orderCode} đã được hủy thành công.`);
            setIsSuccess(true);
          } else {
            const errorMessage =
              res?.data?.message || res?.message || "Vui lòng thử lại.";
            notifyError(`Hủy đơn hàng thất bại: ${errorMessage}`);
            setMessage(`Không thể hủy đơn hàng ${orderCode}.`);
            setIsSuccess(false);
          }
        } catch (error) {
          notifyError("Đã xảy ra lỗi trong quá trình hủy đơn hàng!");
          setMessage(`Không thể hủy đơn hàng ${orderCode}.`);
          console.error(error);
          setIsSuccess(false);
        } finally {
          setLoading(false);
        }
      } else {
        setMessage("Thông tin không hợp lệ để hủy đơn hàng.");
        setLoading(false);
        setIsSuccess(false);
      }
    }
    cancelOrder();
  }, [cancel, orderCode, status]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!loading) {
      timer = setTimeout(() => {
        router.push("/");
      }, 4000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [loading, router]);

  const renderIcon = () => {
    if (loading) return <InfoIcon fontSize="large" color="info" />;
    if (isSuccess === true)
      return <CheckCircleIcon fontSize="large" color="success" />;
    if (isSuccess === false)
      return <ErrorIcon fontSize="large" color="error" />;
    return <InfoIcon fontSize="large" color="info" />;
  };

  return (
    <Box
      sx={{
        p: 4,
        minHeight: "50vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Card sx={{ maxWidth: 500, width: "100%", textAlign: "center" }}>
        <CardContent>
          <Stack
            direction="column"
            alignItems="center"
            justifyContent="center"
            spacing={2}
          >
            {renderIcon()}
            <Typography variant="h5" gutterBottom>
              {loading ? "Đang xử lý..." : "Kết quả hủy đơn hàng"}
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : (
              <Typography variant="body1" gutterBottom>
                {message}
              </Typography>
            )}

            <Typography variant="body2" color="text.secondary">
              Bạn sẽ được chuyển về trang chủ sau vài giây...
            </Typography>

            <Button
              variant="contained"
              onClick={() => router.push("/")}
              disabled={loading}
            >
              Quay lại Trang Chủ
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
