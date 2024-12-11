import { get } from "lodash";
import { IdParams } from "../../../../../models/Common.model";
import { notFound } from "next/navigation";
import EditShippingRuleView from "../../../../../sections/admin/shipping-rule/view/EditShippingRule";
import ShippingRule from "../../../../../services/ShippingRule";

export default async function EditShippingRule({ params }: IdParams) {
  try {
    const fs = await ShippingRule.findOne(String(params.id));
    const infoFS = get(fs, "data.data", {});
    return <EditShippingRuleView shippingRule={infoFS} />;
  } catch (error) {
    notFound();
  }
}
