import { cookies } from "next/headers";
import { get } from "lodash";
import CouponsDView from "../../../../sections/admin/coupons-d/view/CouponsDView";
import Coupons from "../../../../services/Coupons";

export default async function CouponsPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;
  const coupons = await Coupons.getAllCoupons(token);
  const infoCon = get(coupons, "data", {});
  return <CouponsDView couponsData={infoCon} token={token} />;
}
