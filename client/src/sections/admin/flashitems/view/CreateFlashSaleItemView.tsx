import { cookies } from "next/headers";
import WrapperPage from "../../../WrapperPage";
import FlashSaleItemForm from "../components/FlashSaleItemForm";
import Products from "../../../../services/Products";
import { get } from "lodash";

export default async function CreateFlashSaleItemView() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;

  const products = await Products.getByListProduct();
  const infoPro = get(products, "data.products", {});
  try {
    return (
      <WrapperPage title="Thêm Sản Phẩm Flash Sale">
        <FlashSaleItemForm products={infoPro} token={token} />
      </WrapperPage>
    );
  } catch (error) {
    return (
      <WrapperPage title="Thêm Sản Phẩm Flash Sale">
        <p>Không thể tải tạo flash sale. Vui lòng thử lại sau!</p>
      </WrapperPage>
    );
  }
}
