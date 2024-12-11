import { get } from "lodash";
import EditFlashSaleItemView from "../../../../../../../sections/admin/flashitems/view/EditFlashSaleItemView";
import { IdParams } from "../../../../../../../models/Common.model";
import FlashSaleItem from "../../../../../../../services/FlashSaleItem";

export default async function EditFlashSaleItemPage({ params }: IdParams) {
  const flashsales = await FlashSaleItem.findOne(params.vid);
  const infoFSI = get(flashsales, "data", {});
  return <EditFlashSaleItemView flashitem={infoFSI} />;
}
