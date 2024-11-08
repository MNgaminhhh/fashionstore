import { cookies } from "next/headers";
import WrapperPage from "../../../WrapperPage";
import BrandForm from "../components/BrandForm";
import Vendor from "../../../../services/Vendor";
import { get } from "lodash";
export default async function CreateBrandView() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;
  const filters = { status: "accepted" };
  const vendors = await Vendor.getList(token, true, filters);
  const infoVendor = get(vendors, "data.data.vendors", {});
  return (
    <WrapperPage title="Tạo Thương Hiệu">
      <BrandForm vendor={infoVendor} />
    </WrapperPage>
  );
}
