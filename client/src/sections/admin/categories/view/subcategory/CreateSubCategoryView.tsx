import { cookies } from "next/headers";
import { get } from "lodash";
import WrapperPage from "../../../../WrapperPage";
import Categories from "../../../../../services/Categories";
import SubCategoryForm from "../../components/subcategory/SubCategoryForm";

export default async function CreateSubCategoryView() {
    const cookieStore = cookies();
    const token = cookieStore.get("access_cookie")?.value;
    try {
        const listCat = await Categories.getList(token, true);
        const infoCat = get(listCat, "data.categories", {});

        return (
            <WrapperPage title="Tạo Danh Mục Con">
                <SubCategoryForm categories={infoCat} />
            </WrapperPage>
        );
    } catch (error) {
        return (
            <WrapperPage title="Tạo Danh Mục Con">
                <p>Không thể tải danh sách danh mục cha. Vui lòng thử lại sau.</p>
            </WrapperPage>
        );
    }
}
