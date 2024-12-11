import { cookies } from "next/headers";
import WrapperPage from "../../../WrapperPage";
import CouponsForm from "../components/CouponsForm";

export default async function CreateCouponsView() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;
  try {
    return (
      <WrapperPage title="Tạo Điều Kiện Mã Giảm Giá">
        <CouponsForm token={token} />
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
