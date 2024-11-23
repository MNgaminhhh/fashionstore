import VendorView from "../../../../../sections/landing/view/VendorView";
import {cookies} from "next/headers";
import User from "../../../../../services/User";
import {get} from "lodash";
import Vendor from "../../../../../services/Vendor";

export default async function VendorPage() {
    const cookieStore = cookies();
    const token = cookieStore.get("access_cookie")?.value;
    const filters = { status: "accepted" };
    const vendor = await Vendor.findAll(token, true, 8, 1, filters);
    const infoVendor = get(vendor, "data.data",{});
    return <VendorView vendors={infoVendor} token={token} />;
}
