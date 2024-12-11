import { cookies } from "next/headers";
import WrapperPage from "../../../WrapperPage";
import VariantForm from "../components/VariantForm";
import VariantModel from "../../../../models/Variant.model";

type Props = { variant: VariantModel };

export default async function EditVariantView({ variant }: Props) {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;
  try {
    return (
      <WrapperPage title="Sửa Biến Thể Sản Phẩm">
        <VariantForm variant={variant} token={token} />
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
