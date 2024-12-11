import { cookies } from "next/headers";
import WrapperPage from "../../../WrapperPage";
import ShippingRuleForm from "../components/ShippingForm";

export default async function CreateShippingRuleView() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;
  try {
    return (
      <WrapperPage title="Tạo Qui Tắc Vận Chuyển">
        <ShippingRuleForm token={token} />
      </WrapperPage>
    );
  } catch (error) {
    return (
      <WrapperPage title="Tạo Qui Tắc Vận Chuyển">
        <p>Không thể tải tạo qui tắc vận chuyển. Vui lòng thử lại sau!</p>
      </WrapperPage>
    );
  }
}
