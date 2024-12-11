import { cookies } from "next/headers";
import { get } from "lodash";
import FlashSaleView from "../../../../sections/admin/flashsale/view/FlashSaleView";
import FlashSale from "../../../../services/FlashSale";

export default async function FlashSalePage() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;
  const flashsales = await FlashSale.getFlashSale(token);
  const infoFS = get(flashsales, "data", {});
  return <FlashSaleView flashSales={infoFS} token={token} />;
}
