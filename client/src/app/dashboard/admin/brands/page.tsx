import { cookies } from "next/headers";
import { get } from "lodash";
import BrandsView from "../../../../sections/admin/brands/view/BrandsView";
import Brand from "../../../../services/Brand";
export default async function BrandsPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;
  const brans = await Brand.findAll(token);
  const infoBrand = get(brans, "data.data", {});
  return <BrandsView brands={infoBrand} token={token} />;
}
