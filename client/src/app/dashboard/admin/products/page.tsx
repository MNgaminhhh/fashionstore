import { cookies } from "next/headers";
import { get } from "lodash";
import Products from "../../../../services/Products";
import ProductAdminView from "../../../../sections/admin/products/view/ProductAdminView";

export default async function ProductAdminPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;
  const products = await Products.getAllProduct(10, 1);
  const infoPro = get(products, "data.data", {});
  return <ProductAdminView products={infoPro} token={token} />;
}
