import { cookies } from "next/headers";
import WrapperPage from "../../../WrapperPage";
import VariantForm from "../components/VariantForm";

export default async function CreateVariantView() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;
  try {
    return (
      <WrapperPage title="Tạo Biến Thể Sản Phẩm">
        <VariantForm token={token} />
      </WrapperPage>
    );
  } catch (error) {
    return (
      <WrapperPage title="Tạo Biến Thể Sản Phẩm">
        <p>Không thể tải biến thể của sản phẩm. Vui lòng thử lại sau!</p>
      </WrapperPage>
    );
  }
}
