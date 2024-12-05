import { cookies } from "next/headers";
import WrapperPage from "../../../WrapperPage";
import ShippingRuleModel from "../../../../models/ShippingRule.model";
import ShippingRuleForm from "../components/ShippingForm";

type Props = { shippingRule: ShippingRuleModel };

export default async function EditShippingRuleView({ shippingRule }: Props) {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;
  try {
    return (
      <WrapperPage title="Sửa Qui Tắc Vận Chuyển">
        <ShippingRuleForm shippingRule={shippingRule} token={token} />
      </WrapperPage>
    );
  } catch (error) {
    return (
      <WrapperPage title="Sửa Qui Tắc Vận Chuyển">
        <p>Không thể tải sửa qui tắc vận chuyển. Vui lòng thử lại sau!</p>
      </WrapperPage>
    );
  }
}
