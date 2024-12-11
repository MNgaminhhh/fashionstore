import { get } from "lodash";
import { IdParams } from "../../../../../models/Common.model";
import { notFound } from "next/navigation";
import Orders from "../../../../../services/Order";
import DetailOrderPageView from "../../../../../sections/orders/components/DetailOrderPageView";
export default async function OrderDetailAdminPage({ params }: IdParams) {
  try {
    const order = await Orders.findOne(String(params.id));
    const infoOrder = get(order, "data", {});
    return <DetailOrderPageView orderData={infoOrder} />;
  } catch (error) {
    notFound();
  }
}
