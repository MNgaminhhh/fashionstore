import { cookies } from "next/headers";
import { get } from "lodash";
import WrapperPage from "../../../../../WrapperPage";
import ChildCategoryForm from "../../../components/subcategory/childcategory/ChildCategoryForm";
import SubCategory from "../../../../../../services/SubCategory";

export default async function CreateSubCategoryView() {
    const cookieStore = cookies();
    const token = cookieStore.get("access_cookie")?.value;
    try {
        const listCat = await SubCategory.getList(token, true);
        const infoCat = get(listCat, "data.sub_categories", {});

        return (
            <WrapperPage title="Tạo Danh Mục Con Cấp 2">
                <ChildCategoryForm categories={infoCat} />
            </WrapperPage>
        );
    } catch (error) {
        return (
            <WrapperPage title="Tạo Danh Mục Con">
                <p>Không thể tải danh sách danh mục. Vui lòng thử lại sau.</p>
            </WrapperPage>
        );
    }
}
