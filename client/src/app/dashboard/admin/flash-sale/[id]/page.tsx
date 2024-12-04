import { get } from "lodash";
import { IdParams } from "../../../../../models/Common.model";
import { notFound } from "next/navigation";
import FlashSale from "../../../../../services/FlashSale";
import EditFlashSaleView from "../../../../../sections/admin/flashsale/view/EditFlashSaleView";

export default async function EditCreategories({ params }: IdParams) {
  try {
    const fs = await FlashSale.findOne(String(params.id));
    const infoFS = get(fs, "data.data", {});
    return <EditFlashSaleView flashsale={infoFS} />;
  } catch (error) {
    notFound();
  }
}
