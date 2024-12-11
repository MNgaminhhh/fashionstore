import { cookies } from "next/headers";
import WrapperPage from "../../../WrapperPage";
import FlashSaleForm from "../components/FlashSaleForm";

export default async function CreateFlashSaleView() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;
  try {
    return (
      <WrapperPage title="Tạo Flash Sale">
        <FlashSaleForm token={token} />
      </WrapperPage>
    );
  } catch (error) {
    return (
      <WrapperPage title="Tạo Flash Sale">
        <p>Không thể tải tạo flash sale. Vui lòng thử lại sau!</p>
      </WrapperPage>
    );
  }
}
