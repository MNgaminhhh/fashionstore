import { cookies } from "next/headers";
import WrapperPage from "../../../WrapperPage";
import CouponsDForm from "../components/CouponsDForm";
import Conditions from "../../../../services/Conditions";
import { get } from "lodash";

export default async function CreateCouponsDView() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;

  const condition = await Conditions.getListConditions(token);
  const infoCons = get(condition, "data.conditions", []);

  try {
    return (
      <WrapperPage title="Tạo Điều Kiện Mã Giảm Giá">
        <CouponsDForm cond={infoCons} token={token} />
      </WrapperPage>
    );
  } catch (error) {
    return (
      <WrapperPage title="Tạo Điều Kiện Mã Giảm Giá">
        <p>Không thể tải tạo điều kiện mã giảm giá. Vui lòng thử lại sau!</p>
      </WrapperPage>
    );
  }
}
