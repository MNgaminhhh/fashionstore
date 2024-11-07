import BannerModel from "../../../../models/Banner.model";
import WrapperPage from "../../../WrapperPage";
import BannerForm from "../components/BannerForm";
type Props = { banner: BannerModel };
export default function EditBannerView({ banner }: Props) {
  return (
    <WrapperPage title="Chỉnh Sửa Banner">
      <BannerForm banner={banner} />
    </WrapperPage>
  );
}
