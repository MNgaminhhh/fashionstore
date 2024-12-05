import { cookies } from "next/headers";
import WrapperPage from "../../../WrapperPage";
import CouponsDForm from "../components/CouponsDForm";
import Conditions from "../../../../services/Conditions";
import { get } from "lodash";
import CouponModel from "../../../../models/Coupon.model";
type Props = {
  coupon: CouponModel;
};
export default async function ({ coupon }: Props) {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;

  const condition = await Conditions.getListConditions(token);
  const infoCons = get(condition, "data.conditions", []);

  try {
    return (
      <WrapperPage title="Sửa Mã Giảm Giá">
        <CouponsDForm coupon={coupon} cond={infoCons} token={token} />
      </WrapperPage>
    );
  } catch (error) {
    return (
      <WrapperPage title="Sửa Mã Giảm Giá">
        <p>Không thể tải sửa mã giảm giá. Vui lòng thử lại sau!</p>
      </WrapperPage>
    );
  }
}
