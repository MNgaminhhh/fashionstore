import { cookies } from "next/headers";
import { get } from "lodash";
import CouponsView from "../../../../sections/admin/coupons/views/CouponsView";
import Conditions from "../../../../services/Conditions";

export default async function ConditionsPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;
  const conditions = await Conditions.getAllConditions(token);
  const infoCon = get(conditions, "data", {});
  return <CouponsView conditionsData={infoCon} token={token} />;
}
