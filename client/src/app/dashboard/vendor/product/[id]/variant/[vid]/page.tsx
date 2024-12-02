import { get } from "lodash";
import { IdParams } from "../../../../../../../models/Common.model";
import Variant from "../../../../../../../services/Variant";
import { notFound } from "next/navigation";
import EditVariantView from "../../../../../../../sections/(option)/variant/view/EditVariantView";

export default async function EditVariant({ params }: IdParams) {
  try {
    const variant = await Variant.findOne(String(params.vid));
    const infoVar = get(variant, "data.data", {});
    return <EditVariantView variant={infoVar} />;
  } catch (error) {
    notFound();
  }
}
