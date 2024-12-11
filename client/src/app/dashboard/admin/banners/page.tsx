import { cookies } from "next/headers";
import { get } from "lodash";
import Banner from "../../../../services/Banner";
import BannersView from "../../../../sections/admin/banners/view/BannersView";
export default async function BannerPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;
  const banners = await Banner.getTableFilter(token);
  const infoBanner = get(banners, "data.data", {});
  return <BannersView banners={infoBanner} token={token} />;
}
