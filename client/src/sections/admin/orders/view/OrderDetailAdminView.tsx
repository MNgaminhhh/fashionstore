"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import Orders from "../../../../services/Order";
import {
  notifyError,
  notifySuccess,
} from "../../../../utils/ToastNotification";
import { tableHeading2 } from "../components/data";
import { H1, H3, H4 } from "../../../../components/Typography";

const mappingType: { [key: string]: string } = {
  pending: "Đang Chuẩn Bị Hàng",
  paying: "Chờ Thanh Toán",
  shipping: "Đang Vận Chuyển",
  delivered: "Đã Giao Hàng",
  canceled: "Hủy",
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.text.primary,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledIconButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const StyledPagination = styled(Button)(({ theme }) => ({}));

type Props = {
  orderData: any;
  token: string;
};

export default function OrderDetailAdminView({ orderData, token }: Props) {
  const router = useRouter();
  const [order, setOrder] = useState<any>(orderData.orderBill);
  const [skus, setSkus] = useState<any[]>(orderData.skus);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      order_status: order.order_status,
    },
    validationSchema: Yup.object({
      order_status: Yup.string()
        .oneOf(Object.keys(mappingType), "Trạng thái không hợp lệ")
        .required("Trạng thái là bắt buộc"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await Orders.updateStatusByAdmin(
          order.id,
          values.order_status,
          token
        );
        if (response.success) {
          notifySuccess("Cập nhật trạng thái đơn hàng thành công.");
          setOrder(response.data.orderBill);
        } else {
          notifyError(
            response.message || "Cập nhật trạng thái đơn hàng thất bại."
          );
        }
      } catch (err: any) {
        notifyError(
          err.message || "Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng."
        );
      } finally {
        setLoading(false);
      }
    },
  });

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("vi-VN") + "₫";
  };

  const getStatusChip = (status: string) => {
    let color:
      | "default"
      | "primary"
      | "secondary"
      | "success"
      | "error"
      | "warning" = "default";
    let label = mappingType[status] || status;

    switch (status) {
      case "pending":
        color = "warning";
        break;
      case "paying":
        color = "info";
        break;
      case "shipping":
        color = "primary";
        break;
      case "delivered":
        color = "success";
        break;
      case "canceled":
        color = "error";
        break;
      default:
        color = "default";
    }

    return <Chip label={label} color={color} />;
  };

  return (
    <Box p={4}>
      <H1 marginBottom={2}>Chi Tiết Đơn Hàng</H1>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <H4>Mã đơn hàng:</H4>
              <H4 color="#1976d2" gutterBottom>
                #{order.id}
              </H4>
            </Grid>

            <Grid item xs={12} sm={6}>
              <H4>Trạng thái:</H4>
              {getStatusChip(order.order_status)}
            </Grid>
            <Grid item xs={12} sm={6}>
              <H4>Phương thức thanh toán:</H4>
              <H4>
                {order.paying_method === "QR_CODE"
                  ? "QR Code"
                  : order.paying_method}
              </H4>
            </Grid>

            <Grid item xs={12} sm={6}>
              <H4>Tổng tiền:</H4>
              <H4>{formatCurrency(order.total_bill)}</H4>
            </Grid>

            <Grid item xs={12} sm={6}>
              <H4>Ngày tạo:</H4>
              <Typography variant="body1">
                {formatDate(order.created_at)}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Ngày cập nhật:</Typography>
              <Typography variant="body1">
                {formatDate(order.updated_at)}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <H3 marginBottom={3}>Thông Tin Người Nhận</H3>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Tên:</strong>{" "}
                {order.receiver.receiver_name || "Không có thông tin"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Số điện thoại:</strong>{" "}
                {order.receiver.phone_number || "Không có thông tin"}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Địa chỉ:</strong>{" "}
                {order.receiver.address || "Không có thông tin"}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Email:</strong>{" "}
                {order.receiver.email || "Không có thông tin"}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <H3>Danh Sách Sản Phẩm</H3>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {tableHeading2.map((headCell) => (
                    <StyledTableCell
                      key={headCell.id}
                      align={headCell.align}
                      width={headCell.width}
                    >
                      {headCell.label}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {skus.map((sku) => (
                  <TableRow key={sku.sku_id}>
                    <TableCell align="left">
                      {formatDate(sku.updated_at)}
                    </TableCell>

                    <TableCell align="left">
                      <Box display="flex" gap={1}>
                        {sku.product_image && sku.product_image.length > 0 ? (
                          sku.product_image
                            .slice(0, 3)
                            .map((img: string, index: number) => (
                              <img
                                key={index}
                                src={img}
                                alt={sku.product_name}
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover",
                                  borderRadius: "4px",
                                }}
                              />
                            ))
                        ) : (
                          <Typography variant="body2">
                            Không có hình ảnh
                          </Typography>
                        )}
                      </Box>
                    </TableCell>

                    <TableCell align="left">
                      {sku.store_name || "Không có thông tin"}
                    </TableCell>
                  </TableRow>
                ))}
                {skus.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={tableHeading2.length} align="center">
                      Không tìm thấy sản phẩm nào trong đơn hàng này.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <H3 marginBottom={4}>Cập Nhật Trạng Thái Đơn Hàng</H3>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="order_status-label">Trạng thái</InputLabel>
                  <Select
                    labelId="order_status-label"
                    id="order_status"
                    name="order_status"
                    value={formik.values.order_status}
                    label="Trạng thái"
                    onChange={formik.handleChange}
                    error={
                      formik.touched.order_status &&
                      Boolean(formik.errors.order_status)
                    }
                  >
                    {Object.entries(mappingType).map(([key, value]) => (
                      <MenuItem key={key} value={key}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.order_status &&
                    formik.errors.order_status && (
                      <Typography variant="caption" color="error">
                        {formik.errors.order_status}
                      </Typography>
                    )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Cập Nhật"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="outlined"
          onClick={() => router.push("/dashboard/admin/orders")}
        >
          Quay lại
        </Button>
      </Box>
    </Box>
  );
}
