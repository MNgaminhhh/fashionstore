import { cookies } from "next/headers";
import { get } from "lodash";
import { IdParams } from "../../../../../../models/Common.model";
import Skus from "../../../../../../services/Skus";
import SkuView from "../../../../../../sections/(option)/sku/view/SkuView";
import Products from "../../../../../../services/Products";

export default async function SkuVendorPage({ params }: IdParams) {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;

  const filters = { productId: params.id };
  const skus = await Skus.getByVendor(token, true, 10, 1, filters);
  const infoSku = get(skus, "data", {});

  const product = await Products.findOne(params.id);
  const infoPro = get(product, "data.data", {});

  return <SkuView token={token} skus={infoSku} pro={infoPro} />;
}
