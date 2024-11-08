import VendorModel from "../../../../models/Vendor.model";
import WrapperPage from "../../../WrapperPage";
import VendorForm from "../components/VendorForm";
type Props = { vendor: VendorModel };
export default function EditVendorView({ vendor }: Props) {
  return (
    <WrapperPage title="Chỉnh Sửa Nhà Bán Hàng">
      <VendorForm vendor={vendor} />
    </WrapperPage>
  );
}
