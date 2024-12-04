import { cookies } from "next/headers";
import WrapperPage from "../../../WrapperPage";
import VariantModel from "../../../../models/Variant.model";
import SkuForm from "../components/SkuForm";

type Props = { variant: VariantModel };

export default async function EditSkuView({ sku }: Props) {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;
  try {
    return (
      <WrapperPage title="Sửa Biến Thể Sản Phẩm">
        <SkuForm sku={sku} token={token} />
      </WrapperPage>
    );
  } catch (error) {
    return (
      <WrapperPage title="Sửa Biến Thể Sản Phẩm">
        <p>Không thể tải biến thể của sản phẩm. Vui lòng thử lại sau!</p>
      </WrapperPage>
    );
  }
}
