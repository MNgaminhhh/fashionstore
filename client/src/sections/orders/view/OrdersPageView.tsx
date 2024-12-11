"use client";

import { Fragment } from "react";
import ShoppingBag from "@mui/icons-material/ShoppingBag";
import Header from "../../customer/components/Header";
import OrderRow from "../components/OrderRow";

type Props = { orders: any };

export default function OrdersPageView({ orders }: Props) {
  console.log(orders);
  return (
    <Fragment>
      <Header Icon={ShoppingBag} title="Danh sách đặt hàng" />

      {orders.order_bills.map((order) => (
        <OrderRow order={order} key={order.id} />
      ))}
    </Fragment>
  );
}
