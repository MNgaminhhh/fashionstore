import VendorsView from "../../../../sections/admin/vendors/view/VendorsView";
import Vendor from "../../../../services/Vendor";
import { cookies } from "next/headers";
import { get } from "lodash";
export default async function VendorDashboard() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;
  const vendor = await Vendor.findAll(token);
  const infoVendor = get(vendor, "data.data", {});
  return <VendorsView vendors={infoVendor} token={token} />;
}
