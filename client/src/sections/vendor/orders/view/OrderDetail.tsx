"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { format, parse } from "date-fns";
import { useRouter } from "next/navigation";
import { H2 } from "../../../../components/Typography";
import {
  notifyError,
  notifySuccess,
} from "../../../../utils/ToastNotification";
import Orders from "../../../../services/Order";
import { useAppContext } from "../../../../context/AppContext";

const mappingType: { [key: string]: string } = {
  pending: "Đang Chuẩn Bị Hàng",
  paying: "Đang Thanh Toán",
  shipping: "Đang Vận Chuyển",
  delivered: "Đã Giao Hàng",
  canceled: "Hủy",
};

type Props = {
  orderDetail: {
    orderBill: {
      id: string;
      order_status: string;
      product_total: number;
      shipping_fee: number;
      total_bill: number;
      receiver: {
        receiver_name: string;
        phone_number: string;
        address: string;
        email: string;
      };
      paying_method: string;
      created_at: string;
      updated_at: string;
    };
    skus: Array<{
      sku_id: string;
      vendor_id: string;
      store_name: string;
      banner: string;
      product_name: string;
      product_image: string[] | null;
      quantity: number;
      price: number;
      offer_price: number;
      is_prepared: boolean;
      updated_at: string;
    }>;
  };
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 500,
  color: "#333",
}));

const OrderDetail: React.FC<Props> = ({ orderDetail }) => {
  console.log(orderDetail);
  const router = useRouter();
  const { orderBill, skus } = orderDetail;
  const { sessionToken } = useAppContext();
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const handleBack = () => {
    router.push("/dashboard/vendor/orders");
  };

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      const newStatus = !skus[0].is_prepared;
      const response = await Orders.updateStatusByVendor(
        orderBill.id,
        newStatus,
        sessionToken,
        true
      );

      if (response.success) {
        notifySuccess("Đã cập nhật trạng thái đơn hàng thành công.");
        router.refresh();
      } else {
        notifyError(
          response.message || "Cập nhật trạng thái đơn hàng thất bại."
        );
      }
    } catch (error: any) {
      notifyError(
        error.message || "Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng."
      );
    } finally {
      setIsUpdating(false);
      setDialogOpen(false);
    }
  };

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <H2>Chi tiết Đơn hàng</H2>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Thông tin đơn hàng
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Mã đơn hàng:</strong> #{formatOrderId(orderBill.id)}
              </Typography>
              <Typography variant="body1">
                <strong>Trạng thái:</strong>{" "}
                {mappingType[orderBill.order_status] ||
                  orderBill.order_status ||
                  "-"}
              </Typography>
              <Typography variant="body1">
                <strong>Phương thức thanh toán:</strong>{" "}
                {formatPaymentMethod(orderBill.paying_method)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Ngày tạo:</strong> {formatDate(orderBill.created_at)}
              </Typography>
              <Typography variant="body1">
                <strong>Ngày cập nhật:</strong>{" "}
                {formatDate(orderBill.updated_at)}
              </Typography>
              <Typography variant="body1">
                <strong>Tổng bill:</strong>{" "}
                {formatCurrency(orderBill.total_bill)}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Thông tin người nhận
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Tên người nhận:</strong>{" "}
                {orderBill.receiver.receiver_name}
              </Typography>
              <Typography variant="body1">
                <strong>Số điện thoại:</strong>{" "}
                {orderBill.receiver.phone_number}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Địa chỉ:</strong> {orderBill.receiver.address}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {orderBill.receiver.email}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Danh sách sản phẩm
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Sản phẩm</StyledTableCell>
                  <StyledTableCell align="center">Số lượng</StyledTableCell>
                  <StyledTableCell align="right">Giá</StyledTableCell>
                  <StyledTableCell align="right">Giá ưu đãi</StyledTableCell>
                  <StyledTableCell align="center">Trạng thái</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {skus.map((sku) => (
                  <TableRow key={sku.sku_id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        {sku.product_image && sku.product_image.length > 0 ? (
                          <Avatar
                            src={sku.product_image[0]}
                            variant="square"
                            sx={{ width: 64, height: 64, mr: 2 }}
                          />
                        ) : (
                          <Avatar
                            variant="square"
                            sx={{
                              width: 64,
                              height: 64,
                              mr: 2,
                              backgroundColor: "#ccc",
                            }}
                          />
                        )}
                        <Box>
                          <Typography variant="body1" fontWeight="bold">
                            {sku.product_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            SKU ID: {formatOrderId(sku.sku_id)}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">{sku.quantity}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(sku.price)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(sku.offer_price)}
                    </TableCell>
                    <TableCell align="center">
                      {sku.is_prepared ? (
                        <Typography variant="body2" color="green">
                          Đã chuẩn bị
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="orange">
                          Chưa chuẩn bị
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Box display="flex" justifyContent="flex-end" mt={4} gap={2}>
        <Button variant="contained" color="primary" onClick={handleBack}>
          Quay lại danh sách đơn hàng
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={openDialog}
          disabled={orderBill.order_status === "shipping" || isUpdating}
        >
          {isUpdating ? (
            <CircularProgress size={24} />
          ) : (
            "Đã chuẩn bị hàng xong"
          )}
        </Button>
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        aria-labelledby="update-status-dialog-title"
        aria-describedby="update-status-dialog-description"
      >
        <DialogTitle id="update-status-dialog-title">
          Xác nhận cập nhật trạng thái
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="update-status-dialog-description">
            Bạn có chắc chắn muốn đánh dấu đơn hàng này là đã chuẩn bị hàng
            xong?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleUpdateStatus} autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {updateError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {updateError}
        </Alert>
      )}
    </Box>
  );
};

export default OrderDetail;

function formatOrderId(orderId: string): string {
  return orderId.length > 8
    ? `${orderId.slice(0, 8).toUpperCase()}...`
    : orderId.toUpperCase();
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatDate(dateString: string): string {
  const parsedDate = parse(dateString, "dd-MM-yyyy HH:mm", new Date());

  if (isNaN(parsedDate.getTime())) {
  }
  return format(parsedDate, "dd-MM-yyyy HH:mm");
}
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function formatPaymentMethod(method: string): string {
  switch (method) {
    case "QR_CODE":
      return "QR Code";
    case "CASH":
      return "Tiền mặt";
    default:
      return method;
  }
}
