import { cookies } from "next/headers";
import WrapperPage from "../../../WrapperPage";
import FlashSaleForm from "../components/FlashSaleForm";
import FlashSaleModel from "../../../../models/FlashSale.model";

type Props = { flashsale: FlashSaleModel };

export default async function EditFlashSaleView({ flashsale }: Props) {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;
  try {
    return (
      <WrapperPage title="Sửa Flash Sale">
        <FlashSaleForm flashSale={flashsale} token={token} />
      </WrapperPage>
    );
  } catch (error) {
    return (
      <WrapperPage title="Sửa Flash Sale">
        <p>Không thể tải sửa flash sale. Vui lòng thử lại sau!</p>
      </WrapperPage>
    );
  }
}
