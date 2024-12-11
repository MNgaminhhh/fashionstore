import { cookies } from "next/headers";
import { get } from "lodash";
import OptionVariant from "../../../../../../../../services/OptionVariant";
import OptionVariantView from "../../../../../../../../sections/(option)/options/view/OptionVariantView";
import { IdParams } from "../../../../../../../../models/Common.model";

export default async function OptionVariantPage({ params }: IdParams) {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;
  const opVari = await OptionVariant.getOpVariant(params.vid, token);
  const infoOpVari = get(opVari, "data", {});
  return <OptionVariantView token={token} opvariant={infoOpVari} />;
}
