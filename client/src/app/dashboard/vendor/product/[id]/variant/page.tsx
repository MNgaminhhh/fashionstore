import { cookies } from "next/headers";
import { get } from "lodash";
import VariantView from "../../../../../../sections/(option)/variant/view/VariantView";
import Variant from "../../../../../../services/Variant";
import { IdParams } from "../../../../../../models/Common.model";

export default async function VariantPage({ params }: IdParams) {
  // String(params.id)
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;
  const vari = await Variant.getVariantByProduct(token);
  const infoVari = get(vari, "data", {});
  return <VariantView token={token} variants={infoVari} />;
}