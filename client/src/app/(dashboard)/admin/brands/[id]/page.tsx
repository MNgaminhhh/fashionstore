import { get } from "lodash";
import { IdParams } from "../../../../../models/Common.model";
import { notFound } from "next/navigation";
import EditBrandView from "../../../../../sections/admin/brands/view/EditBrandView";
import Brand from "../../../../../services/Brand";
export default async function EditBrand({ params }: IdParams) {
  try {
    const brand = await Brand.findOne(String(params.id));
    const info = get(brand, "data.data", {});
    return <EditBrandView brand={info} />;
  } catch (error) {
    notFound();
  }
}
