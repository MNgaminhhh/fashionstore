import { cookies } from "next/headers";
import { get } from "lodash";
import ProductForm from "../components/ProductForm";
import Categories from "../../../../services/Categories";
import WrapperPage from "../../../WrapperPage";
import ProductModel from "../../../../models/Product.model";
type Props = { product: ProductModel };
export default async function EditProductView({ product }: Props) {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;
  try {
    const listCat = await Categories.getList(token, true);
    const infoCat = get(listCat, "data.categories", []);
    return (
      <WrapperPage title="Sửa Sản Phẩm">
        <ProductForm token={token} cat={infoCat} product={product} />
      </WrapperPage>
    );
  } catch (error) {
    return (
      <WrapperPage title="Sửa Sản Phẩm">
        <p>Không thể tải sản phẩm. Vui lòng thử lại sau!</p>
      </WrapperPage>
    );
  }
}
