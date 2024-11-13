import WrapperPage from "../../../WrapperPage";
import CategoriesForm from "../components/CategoriesForm";
export default async function CreateCategoriesView() {
    return (
        <WrapperPage title="Tạo Danh Mục">
            <CategoriesForm />
        </WrapperPage>
    );
}
