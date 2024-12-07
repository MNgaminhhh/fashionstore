import WrapperPage from "../../../WrapperPage";
import VariantModel from "../../../../models/Variant.model";
import SkuModel from "../../../../models/Sku.model";
import SkuEditForm from "../components/SkuEditForm";

type Props = { sku: SkuModel; varOp: VariantModel; token: string };

export default async function EditSkuView({ sku }: Props) {
  try {
    return (
      <WrapperPage title="Sửa Biến Thể Sản Phẩm">
        <SkuEditForm initialData={sku} />
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
