import BrandsModel from "../../../../models/Brands.model";
import WrapperPage from "../../../WrapperPage";
import BrandForm from "../components/BrandForm";
export default function CreateBrandView() {
  return (
    <WrapperPage title="Tạo Thương Hiệu">
      <BrandForm />
    </WrapperPage>
  );
}
