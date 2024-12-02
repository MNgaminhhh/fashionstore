import { cookies } from "next/headers";
import WrapperPage from "../../../WrapperPage";
import OptionVariantForm from "../components/OptionVariantForm";
import OptionVariantModel from "../../../../models/OptionVariant.model";

type Props = { opvariant: OptionVariantModel };

export default async function EditOptionVariantView({ opvariant }: Props) {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;
  try {
    return (
      <WrapperPage title="Sửa Tùy Chọn Biến Thể">
        <OptionVariantForm optionVariant={opvariant} token={token} />
      </WrapperPage>
    );
  } catch (error) {
    return (
      <WrapperPage title="Sửa Tùy Chọn Biến Thể">
        <p>Không thể tải biến thể của sản phẩm. Vui lòng thử lại sau!</p>
      </WrapperPage>
    );
  }
}
