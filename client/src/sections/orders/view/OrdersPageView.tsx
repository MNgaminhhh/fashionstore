// components/OrdersPageView.tsx

"use client";

import { Fragment } from "react";
import ShoppingBag from "@mui/icons-material/ShoppingBag";
import Header from "../../customer/components/Header";
import OrderRow from "../components/OrderRow";
import { Card, Grid } from "@mui/material";
import { H3, Small } from "../../../components/Typography";

type Sku = {
  product_name: string;
  images: string[];
  variant_option: { product_variant: string; variant_options: string }[];
  quantity: number;
  price: number;
  offer_price: number;
};

type OrderBill = {
  id: string;
  order_status: string;
  total_bill: number;
  updated_at: string;
  skus: Sku[];
  store_name: string;
  number_product: number;
};

type OrdersData = {
  cancel_count: number;
  delivered_count: number;
  limit: number;
  order_bills: OrderBill[];
  page: number;
  paying_count: number;
  pending_count: number;
  shipping_count: number;
  total_pages: number;
  total_results: number;
};

type Props = { orders: OrdersData };

export default function OrdersPageView({ orders }: Props) {
  const LIST_ORDER = [
    { title: orders.total_results.toString(), subtitle: "Tất cả đơn hàng" },
    { title: orders.pending_count.toString(), subtitle: "Đang chuẩn bị hàng" },
    { title: orders.paying_count.toString(), subtitle: "Chờ thanh toán" },
    { title: orders.shipping_count.toString(), subtitle: "Chờ vận chuyển" },
    { title: orders.delivered_count.toString(), subtitle: "Chờ giao hàng" },
    { title: orders.cancel_count.toString(), subtitle: "Hủy" },
  ];

  return (
    <Fragment>
      <Header Icon={ShoppingBag} title="Danh sách đặt hàng" />
      <Grid container spacing={2} md={12} xs={12} sx={{ mt: 3 }}>
        {LIST_ORDER.map((item) => (
          <Grid item lg={2} sm={2} xs={2} key={item.subtitle}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                p: "1.25rem",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <H3
                color="primary.main"
                my={0}
                fontWeight={700}
                sx={{ fontSize: "1.75rem" }}
              >
                {item.title}
              </H3>
              <Small
                color="grey.700"
                textAlign="center"
                sx={{ fontSize: "0.875rem", fontWeight: "500" }}
              >
                {item.subtitle}
              </Small>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid>
        {orders.order_bills.map((order) => (
          <Grid item xs={12} key={order.id}>
            <OrderRow order={order} />
          </Grid>
        ))}
      </Grid>
    </Fragment>
  );
}
