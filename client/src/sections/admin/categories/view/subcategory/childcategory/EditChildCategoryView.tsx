import { cookies } from "next/headers";
import { get } from "lodash";
import WrapperPage from "../../../../../WrapperPage";
import SubCategory from "../../../../../../services/SubCategory";
import ChildCategoryForm from "../../../components/subcategory/childcategory/ChildCategoryForm";

type Props = {
    childCategory: any;
};

export default async function EditChildCategoryView({ childCategory }: Props) {
    const cookieStore = cookies();
    const token = cookieStore.get("access_cookie")?.value;

    try {
        const listCat = await SubCategory.getList(token, true);
        const infoCat = get(listCat, "data.sub_categories", {});

        return (
            <WrapperPage title="Chỉnh Sửa Danh Mục Con Cấp 2">
                <ChildCategoryForm categories={infoCat} childCategory={childCategory} />
            </WrapperPage>
        );
    } catch (error) {
        return (
            <WrapperPage title="Chỉnh Sửa Danh Mục Con">
                <p>
                    Không thể tải danh sách danh mục cha hoặc thông tin danh mục con.
                    Vui lòng thử lại sau.
                </p>
            </WrapperPage>
        );
    }
}
