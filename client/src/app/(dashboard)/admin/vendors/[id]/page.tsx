import { get } from "lodash";
import Vendor from "../../../../../services/Vendor";
import { IdParams } from "../../../../../models/Common.model";
import { notFound } from "next/navigation";
import EditVendorView from "../../../../../sections/admin/vendors/view/EditVendorView";
export default async function EditVendor({ params }: IdParams) {
  try {
    const vendor = await Vendor.findOne(String(params.id));
    const info = get(vendor, "data.data", {});
    return <EditVendorView vendor={info} />;
  } catch (error) {
    notFound();
  }
}
