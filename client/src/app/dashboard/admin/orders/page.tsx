import { cookies } from "next/headers";
import { get } from "lodash";
import Orders from "../../../../services/Order";
import OrdersAdminView from "../../../../sections/admin/orders/view/OrdersAdminView";

export default async function ProductVendorPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;
  const orders = await Orders.getAllOrderByAdmin(token);
  const infoOrder = get(orders, "data", {});
  return <OrdersAdminView initialOrders={infoOrder} token={token} />;
}
