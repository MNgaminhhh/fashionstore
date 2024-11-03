import BrandsModel from "../../../../models/Brands.model";
import WrapperPage from "../../../WrapperPage";
import BrandForm from "../components/BrandForm";
type Props = { brand: BrandsModel };
export default function EditBrandView({ brand }: Props) {
  return (
    <WrapperPage title="Chỉnh Sửa Thương Hiệu">
      <BrandForm brand={brand} />
    </WrapperPage>
  );
}
