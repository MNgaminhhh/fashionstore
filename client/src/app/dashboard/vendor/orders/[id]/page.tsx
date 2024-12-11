import { get } from "lodash";
import { IdParams } from "../../../../../models/Common.model";
import { notFound } from "next/navigation";
import Orders from "../../../../../services/Order";
import OrderDetail from "../../../../../sections/vendor/orders/view/OrderDetail";
export default async function OrderDetailPage({ params }: IdParams) {
  try {
    const order = await Orders.findOne(String(params.id));
    const infoOrder = get(order, "data", {});
    return <OrderDetail orderDetail={infoOrder} />;
  } catch (error) {
    notFound();
  }
}
