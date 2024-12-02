import { cookies } from "next/headers";
import WrapperPage from "../../../WrapperPage";
import OptionVariantForm from "../components/OptionVariantForm";

export default async function CreateOptionVariantView() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;
  try {
    return (
      <WrapperPage title="Tạo Biến Thể Sản Phẩm">
        <OptionVariantForm token={token} />
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
