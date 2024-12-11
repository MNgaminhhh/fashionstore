"use client";

import React from "react";
import Header from "../../customer/components/Header";
import ShoppingBag from "@mui/icons-material/ShoppingBag";
import { Box, Typography, Divider, Grid, Button } from "@mui/material";
import { format, parse } from "date-fns";
import { formatCurrency } from "../../../utils/lib";
import SkuItem from "./SkuItem";
import { H2, H4 } from "../../../components/Typography";
import OrderProgress from "./OrderProcess";

export interface Receiver {
  receiver_name: string;
  phone_number: string;
  address: string;
  email: string;
}

export interface OrderBill {
  id: string;
  order_status: string;
  product_total: number;
  discount_product: number;
  shipping_fee: number;
  total_bill: number;
  receiver: Receiver;
  paying_method: string;
  created_at: string;
  updated_at: string;
}

export interface SKU {
  sku_id: string;
  vendor_id: string;
  store_name: string;
  banner: string;
  product_name: string;
  product_image: string[];
  quantity: number;
  price: number;
  offer_price: number;
  is_prepared: boolean;
  updated_at: string;
}

export interface DetailOrderData {
  orderBill: OrderBill;
  skus: SKU[];
}

type Props = {
  orderData: DetailOrderData;
};

const DetailOrderPageView = ({ orderData }: Props) => {
  console.log(orderData);
  const { orderBill, skus } = orderData;
  const mappingType: { [key: string]: string } = {
    pending: "Đang Chuẩn Bị Hàng",
    paying: "Đang Thanh Toán",
    packaging: "Đang Đóng Gói",
    shipping: "Đang Vận Chuyển",
    delivering: "Đang Giao Hàng",
    delivered: "Đã Giao Hàng",
    canceled: "Hủy",
  };

  const formatDate = (dateString: string) => {
    const parsedDate = parse(dateString, "dd-MM-yyyy HH:mm", new Date());
    return format(parsedDate, "dd/MM/yyyy HH:mm");
  };

  const getPaymentMethod = (method: string) => {
    switch (method) {
      case "QR_CODE":
        return "Quét mã QR";
      case "CASH":
        return "Tiền mặt";
      default:
        return method;
    }
  };

  const getEstimatedDeliveryDate = (status: string): string => {
    const currentDate = new Date();
    let estimatedDate = new Date();

    switch (status.toLowerCase()) {
      case "pending":
        estimatedDate.setDate(currentDate.getDate() + 7);
        break;
      case "paying":
        estimatedDate.setDate(currentDate.getDate() + 6);
        break;
      case "packaging":
        estimatedDate.setDate(currentDate.getDate() + 5);
        break;
      case "shipping":
        estimatedDate.setDate(currentDate.getDate() + 3);
        break;
      case "delivering":
        estimatedDate.setDate(currentDate.getDate() + 1);
        break;
      case "delivered":
      case "complete":
      case "canceled":
        estimatedDate = parse(
          orderBill.updated_at,
          "dd-MM-yyyy HH:mm",
          new Date()
        );
        break;
      default:
        estimatedDate.setDate(currentDate.getDate() + 7);
    }

    return format(estimatedDate, "dd/MM/yyyy");
  };

  const estimatedDeliveryDate = getEstimatedDeliveryDate(
    orderBill.order_status
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box p={4}>
      <Header
        Icon={ShoppingBag}
        title="Chi Tiết Đơn Hàng"
        buttonText="Trở Về"
        href={`/orders`}
      />

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePrint}
          sx={{
            display: { xs: "none", sm: "block" },
          }}
        >
          In Hóa Đơn
        </Button>
      </Box>

      <OrderProgress
        orderStatus={orderBill.order_status}
        estimatedDeliveryDate={estimatedDeliveryDate}
      />

      <Box mt={4} id="invoice">
        <Typography variant="h6" fontWeight="bold">
          Thông Tin Đơn Hàng
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography>
              <strong>Mã Đơn Hàng:</strong> #{orderBill.id.substring(0, 18)}
            </Typography>
            <Typography>
              <strong>Trạng Thái:</strong>{" "}
              {mappingType[orderBill.order_status.toLowerCase()]}
            </Typography>
            <Typography>
              <strong>Phương Thức Thanh Toán:</strong>{" "}
              {getPaymentMethod(orderBill.paying_method)}
            </Typography>
            <Typography>
              <strong>Ngày Tạo:</strong> {formatDate(orderBill.created_at)}
            </Typography>
            <Typography>
              <strong>Ngày Cập Nhật:</strong> {formatDate(orderBill.updated_at)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Thông Tin Người Nhận
            </Typography>
            <Typography>
              <strong>Tên:</strong> {orderBill.receiver.receiver_name}
            </Typography>
            <Typography>
              <strong>Số Điện Thoại:</strong> {orderBill.receiver.phone_number}
            </Typography>
            <Typography>
              <strong>Địa Chỉ:</strong> {orderBill.receiver.address}
            </Typography>
            <Typography>
              <strong>Email:</strong> {orderBill.receiver.email}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box mt={4}>
        <Typography variant="h6" fontWeight="bold">
          Danh Sách Sản Phẩm
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          {skus.map((sku) => (
            <Grid item xs={12} key={sku.sku_id}>
              <SkuItem sku={sku} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box
        mt={4}
        display="flex"
        justifyContent="flex-end"
        flexDirection="column"
        alignItems="flex-end"
        gap={1}
      >
        <H4>
          <strong>Tổng Sản Phẩm:</strong>{" "}
          {formatCurrency(orderBill.product_total)}
        </H4>
        <H4>
          <strong>Phí Vận Chuyển:</strong>{" "}
          {formatCurrency(orderBill.shipping_fee)}
        </H4>
        {orderBill.discount_product ? (
          <H4>
            <strong>Giảm giá:</strong>
            {""}-{formatCurrency(orderBill.discount_product)}
          </H4>
        ) : (
          <></>
        )}
        <H2>
          <strong>Tổng Thanh Toán:</strong>{" "}
          {formatCurrency(orderBill.total_bill)}
        </H2>
      </Box>

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePrint}
          sx={{
            display: { xs: "block", sm: "none" },
          }}
        >
          In Hóa Đơn
        </Button>
      </Box>

      <style jsx global>{`
        @media print {
          button {
            display: none !important;
          }
          body {
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </Box>
  );
};

export default DetailOrderPageView;
