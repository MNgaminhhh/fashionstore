import { cookies } from "next/headers";
import { get } from "lodash";
import OrdersView from "../../../../sections/vendor/orders/view/OrdersView";
import Orders from "../../../../services/Order";

export default async function ProductVendorPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;
  const orders = await Orders.getAllOrderByVendor(token);
  const infoOrder = get(orders, "data", {});
  return <OrdersView ordersData={infoOrder} token={token} />;
}
