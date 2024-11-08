import { get } from "lodash";
import { IdParams } from "../../../../../models/Common.model";
import { notFound } from "next/navigation";
import EditBannerView from "../../../../../sections/admin/banners/view/EditBannerView";
import Banner from "../../../../../services/Banner";
export default async function EditBrand({ params }: IdParams) {
  try {
    const banner = await Banner.findOne(String(params.id));
    const info = get(banner, "data.data", {});
    return <EditBannerView banner={info} />;
  } catch (error) {
    notFound();
  }
}
