import { cookies } from "next/headers";
import WrapperPage from "../../../WrapperPage";
import SkuForm from "../components/SkuForm";

export default async function CreateSkuView() {
  try {
    return (
      <WrapperPage title="Tạo Chi Tiết Sản Phẩm">
        <SkuForm token={token} />
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
