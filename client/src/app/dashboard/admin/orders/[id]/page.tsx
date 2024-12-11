import { get } from "lodash";
import { IdParams } from "../../../../../models/Common.model";
import { notFound } from "next/navigation";
import Orders from "../../../../../services/Order";
import OrderDetailAdminView from "../../../../../sections/admin/orders/view/OrderDetailAdminView";
import { cookies } from "next/headers";
export default async function OrderDetailAdminPage({ params }: IdParams) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("access_cookie")?.value;
    const order = await Orders.findOne(String(params.id));
    const infoOrder = get(order, "data", {});
    return <OrderDetailAdminView orderData={infoOrder} token={token} />;
  } catch (error) {
    notFound();
  }
}
