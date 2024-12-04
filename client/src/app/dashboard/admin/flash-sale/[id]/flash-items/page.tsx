import { cookies } from "next/headers";
import { get } from "lodash";
import FlashSaleItemView from "../../../../../../sections/admin/flashitems/view/FlashSaleItemView";
import FlashSaleItem from "../../../../../../services/FlashSaleItem";
import { IdParams } from "../../../../../../models/Common.model";

export default async function FlashSaleItemPage({ params }: IdParams) {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;
  const flashsales = await FlashSaleItem.getFlashSaleItems(params.id, token);
  const infoFSI = get(flashsales, "data", {});
  return <FlashSaleItemView flashSaleItemsData={infoFSI} token={token} />;
}
