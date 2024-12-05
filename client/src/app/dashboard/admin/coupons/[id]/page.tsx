import { get } from "lodash";
import { IdParams } from "../../../../../models/Common.model";
import { notFound } from "next/navigation";
import Conditions from "../../../../../services/Conditions";
import EditCouponsView from "../../../../../sections/admin/coupons/views/EditCouponsView";

export default async function EditShippingRule({ params }: IdParams) {
  try {
    const condition = await Conditions.findOne(String(params.id));
    const infoCon = get(condition, "data.data", {});
    return <EditCouponsView coupon={infoCon} />;
  } catch (error) {
    notFound();
  }
}
