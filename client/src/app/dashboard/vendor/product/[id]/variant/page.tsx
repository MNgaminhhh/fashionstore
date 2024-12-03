import { cookies } from "next/headers";
import { get } from "lodash";
import VariantView from "../../../../../../sections/(option)/variant/view/VariantView";
import Variant from "../../../../../../services/Variant";
import { IdParams } from "../../../../../../models/Common.model";
import Products from "../../../../../../services/Products";

export default async function VariantPage({ params }: IdParams) {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;
  const filters = { productId: params.id };
  const vari = await Variant.getVariantByProduct(token, true, 10, 1, filters);
  const infoVari = get(vari, "data", {});
  const product = await Products.findOne(params.id);
  const infoPro = get(product, "data.data", {});
  return <VariantView token={token} variants={infoVari} pro={infoPro} />;
}
