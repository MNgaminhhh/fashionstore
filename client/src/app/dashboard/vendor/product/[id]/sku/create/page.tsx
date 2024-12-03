import { get } from "lodash";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { IdParams } from "../../../../../../../models/Common.model";
import CreateSkuView from "../../../../../../../sections/(option)/sku/view/CreateSkuView";
import Variant from "../../../../../../../services/Variant";

export default async function CreateSkuPage({ params }: IdParams) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("access_cookie")?.value;
    const filters = { status: "active" };
    const varOp = await Variant.getOpVariant(params.id, token, true, filters);
    const infoVendor = get(varOp, "data.data.vendors", {});
    return <CreateSkuView />;
  } catch (error) {
    notFound();
  }
}
