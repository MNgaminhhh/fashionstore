import { get } from "lodash";
import { notFound } from "next/navigation";
import EditOptionVariantView from "../../../../../../../../../sections/(option)/options/view/EditOptionVariant";
import { IdParams } from "../../../../../../../../../models/Common.model";
import OptionVariant from "../../../../../../../../../services/OptionVariant";

export default async function EditOptionVariant({ params }: IdParams) {
  try {
    const opVariant = await OptionVariant.findOne(String(params.oid));
    const infoOpVar = get(opVariant, "data.data", {});
    return <EditOptionVariantView opvariant={infoOpVar} />;
  } catch (error) {
    notFound();
  }
}
