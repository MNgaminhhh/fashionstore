import { get } from "lodash";
import { IdParams } from "../../../../../models/Common.model";
import { notFound } from "next/navigation";
import EditCouponsDView from "../../../../../sections/admin/coupons-d/view/EditCouponsDView";
import Coupons from "../../../../../services/Coupons";

export default async function EditCouponPage({ params }: IdParams) {
  try {
    const cou = await Coupons.findOne(String(params.id));
    const infoCou = get(cou, "data.data", {});
    return <EditCouponsDView coupon={infoCou} />;
  } catch (error) {
    notFound();
  }
}
