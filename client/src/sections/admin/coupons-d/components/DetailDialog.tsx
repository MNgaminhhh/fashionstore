"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Divider,
  Box,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EventIcon from "@mui/icons-material/Event";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import CouponModel from "../../../../models/Coupon.model";

type DetailDialogProps = {
  open: boolean;
  onClose: () => void;
  coupon: CouponModel | null;
};

const Label = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.secondary,
}));

const Value = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.text.primary,
}));

export default function DetailDialog({
  open,
  onClose,
  coupon,
}: DetailDialogProps) {
  if (!coupon) return null;
  console.log(coupon);
  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", options);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          textAlign: "center",
        }}
      >
        Chi tiết Coupon
      </DialogTitle>
      <Divider />
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" mb={1}>
              <LocalOfferIcon color="action" sx={{ mr: 1 }} />
              <Label variant="subtitle1">Thông Tin Chung</Label>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Label variant="body2">Tên Coupon:</Label>
                <Value variant="body1">{coupon.name || "-"}</Value>
              </Grid>
              <Grid item xs={6}>
                <Label variant="body2">Mã Coupon:</Label>
                <Value variant="body1">{coupon.code || "-"}</Value>
              </Grid>
              <Grid item xs={6}>
                <Label variant="body2">Loại:</Label>
                <Chip
                  label={coupon.type === "fixed" ? "Giá Cố Định" : "Phí (%)"}
                  color={coupon.type === "fixed" ? "success" : "info"}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Grid>
              <Grid item xs={6}>
                <Label variant="body2">Trạng Thái:</Label>
                <Chip
                  label={coupon.status ? "Hoạt động" : "Không hoạt động"}
                  color={coupon.status ? "primary" : "default"}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Grid>
            </Grid>
          </Grid>

          <Divider sx={{ width: "100%", my: 2 }} />

          <Grid item xs={12}>
            <Box display="flex" alignItems="center" mb={1}>
              <AssignmentIcon color="action" sx={{ mr: 1 }} />
              <Label variant="subtitle1">Chi Tiết Tài Chính</Label>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Label variant="body2">Giảm Giá:</Label>
                <Value variant="body1">
                  {coupon.discount.toLocaleString()} VNĐ
                </Value>
              </Grid>
              <Grid item xs={4}>
                <Label variant="body2">Giá Tối Đa:</Label>
                <Value variant="body1">
                  {coupon.max_price.toLocaleString()} VNĐ
                </Value>
              </Grid>
              <Grid item xs={4}>
                <Label variant="body2">Số Lượng:</Label>
                <Value variant="body1">{coupon.quantity}</Value>
              </Grid>
              <Grid item xs={6}>
                <Label variant="body2">Đã Sử Dụng:</Label>
                <Value variant="body1">{coupon.totalUsed}</Value>
              </Grid>
              <Grid item xs={6}>
                <Label variant="body2">Tổng Số Lần Sử Dụng:</Label>
                <Value variant="body1">{coupon.totalUsed}</Value>
              </Grid>
            </Grid>
          </Grid>

          <Divider sx={{ width: "100%", my: 2 }} />

          <Grid item xs={12}>
            <Box display="flex" alignItems="center" mb={1}>
              <EventIcon color="action" sx={{ mr: 1 }} />
              <Label variant="subtitle1">Thời Gian Áp Dụng</Label>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Label variant="body2">Ngày Bắt Đầu:</Label>
                <Value variant="body1">
                  {formatDate(coupon.startDate) || "-"}
                </Value>
              </Grid>
              <Grid item xs={6}>
                <Label variant="body2">Ngày Kết Thúc:</Label>
                <Value variant="body1">
                  {formatDate(coupon.endDate) || "-"}
                </Value>
              </Grid>
            </Grid>
          </Grid>

          <Divider sx={{ width: "100%", my: 2 }} />
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" mb={1}>
              <FormatListBulletedIcon color="action" sx={{ mr: 1 }} />
              <Label variant="subtitle1">Điều Kiện Áp Dụng</Label>
            </Box>
            {coupon.condition.length > 0 ? (
              <Grid container spacing={1}>
                {coupon.condition.map((cond) => (
                  <Grid item xs={12} key={cond.condition_id}>
                    <Chip
                      label={cond.condition_description}
                      variant="outlined"
                      color="secondary"
                      size="small"
                      icon={<AssignmentIcon />}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1">Không có điều kiện nào.</Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
