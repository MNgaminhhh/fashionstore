import { cookies } from "next/headers";
import WrapperPage from "../../../WrapperPage";
import CouponsForm from "../components/CouponsForm";
import CouponModel from "../../../../models/Coupon.model";

type Props = { coupon: CouponModel };

export default async function EditCouponsView({ coupon }: Props) {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;
  try {
    return (
      <WrapperPage title="Sửa Điều Kiện Mã Giảm Giá">
        <CouponsForm coupon={coupon} token={token} />
      </WrapperPage>
    );
  } catch (error) {
    return (
      <WrapperPage title="Sửa Điều Kiện Mã Giảm Giá">
        <p>Không thể tải sửa điều kiện mã giảm giá. Vui lòng thử lại sau!</p>
      </WrapperPage>
    );
  }
}
