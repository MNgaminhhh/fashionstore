import { cookies } from "next/headers";
import { get } from "lodash";
import OrdersPageView from "../../../../sections/orders/view/OrdersPageView";
import Orders from "../../../../services/Order";

export default async function OrdersPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;
  const user = await Orders.getAllOrderByUser(token);
  const infoUser = get(user, "data", {});
  return <OrdersPageView orders={infoUser} />;
}
