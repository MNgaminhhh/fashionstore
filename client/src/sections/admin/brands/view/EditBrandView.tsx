import { cookies } from "next/headers";
import BrandsModel from "../../../../models/Brands.model";
import Vendor from "../../../../services/Vendor";
import WrapperPage from "../../../WrapperPage";
import BrandForm from "../components/BrandForm";
import { get } from "lodash";
type Props = { brand: BrandsModel };
export default async function EditBrandView({ brand }: Props) {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;
  const filters = { status: "accepted" };
  const vendors = await Vendor.getList(token, true, filters);
  const infoVendor = get(vendors, "data.data.vendors", {});
  return (
    <WrapperPage title="Chỉnh Sửa Thương Hiệu">
      <BrandForm brand={brand} vendor={infoVendor} />
    </WrapperPage>
  );
}
