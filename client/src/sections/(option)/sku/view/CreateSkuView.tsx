import WrapperPage from "../../../WrapperPage";
import SkuForm from "../components/SkuForm";
import VariantModel from "../../../../models/Variant.model";
type Props = { varOp: VariantModel[]; token: string };
export default async function CreateSkuView({ varOp, token }: Props) {
  try {
    return (
      <WrapperPage title="Tạo Chi Tiết Sản Phẩm">
        <SkuForm token={token} variOp={varOp} />
      </WrapperPage>
    );
  } catch (error) {
    return (
      <WrapperPage title="Tạo Chi Tiết Sản Phẩm">
        <p>Không thể tải biến thể của sản phẩm. Vui lòng thử lại sau!</p>
      </WrapperPage>
    );
  }
}
