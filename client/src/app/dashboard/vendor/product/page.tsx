import { cookies } from "next/headers";
import { get } from "lodash";
import Products from "../../../../services/Products";
import ProductView from "../../../../sections/vendor/product/view/ProductView";

export default async function ProductVendorPage() {
    const cookieStore = cookies();
    const token = cookieStore.get("access_cookie")?.value;
    const products = await Products.getTableFilter(token);
    const infoPro = get(products, "data.data", {});
    return <ProductView products={infoPro} token={token} />;
}