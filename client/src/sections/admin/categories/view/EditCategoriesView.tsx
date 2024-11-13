import WrapperPage from "../../../WrapperPage";
import CategoriesForm from "../components/CategoriesForm";
import CategoriesModel from "../../../../models/Categories.model";
type Props = { category: CategoriesModel };
export default async function EditCategoriesView({ category }: Props) {
    return (
        <WrapperPage title="Chỉnh Sửa Danh Mục">
            <CategoriesForm category={category} />
        </WrapperPage>
    );
}
