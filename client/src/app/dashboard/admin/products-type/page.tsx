import { cookies } from "next/headers";
import { get } from "lodash";
import Products from "../../../../services/Products";
import ProductTypeAdminView from "../../../../sections/admin/productstype/view/ProductTypeAdminView";

export default async function ProductTypeAdminPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;
  const filters = { is_approved: "true" };
  const products = await Products.getAllProduct(10, 1, filters);
  const infoPro = get(products, "data.data", {});
  return <ProductTypeAdminView products={infoPro} token={token} />;
}
