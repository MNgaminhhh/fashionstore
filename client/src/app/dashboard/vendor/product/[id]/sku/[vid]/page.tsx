import { get } from "lodash";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { IdParams } from "../../../../../../../models/Common.model";
import Variant from "../../../../../../../services/Variant";
import EditSkuView from "../../../../../../../sections/(option)/sku/view/EditSkuView";
import Skus from "../../../../../../../services/Skus";

export default async function EditSkuPage({ params }: IdParams) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("access_cookie")?.value;
    const skus = await Skus.findOne(params.vid);
    const infoSkus = get(skus, "data.data", {});
    return <EditSkuView sku={infoSkus} token={token} />;
  } catch (error) {
    notFound();
  }
}
