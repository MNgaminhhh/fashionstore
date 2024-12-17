import { cookies } from "next/headers";
import { get } from "lodash";
import WrapperPage from "../../../../WrapperPage";
import Categories from "../../../../../services/Categories";
import SubCategoryForm from "../../components/subcategory/SubCategoryForm";

type Props = {
  subcategory: any;
};

export default async function EditSubCategoryView({ subcategory }: Props) {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;

  try {
    const listCatResponse = await Categories.getList(token, true);
    const categories = get(listCatResponse, "data.categories", []);
    return (
      <WrapperPage title="Chỉnh Sửa Danh Mục Con">
        <SubCategoryForm subcategory={subcategory} categories={categories} />
      </WrapperPage>
    );
  } catch (error) {
    return (
      <WrapperPage title="Chỉnh Sửa Danh Mục Con">
        <p>
          Không thể tải danh sách danh mục cha hoặc thông tin danh mục con. Vui
          lòng thử lại sau.
        </p>
      </WrapperPage>
    );
  }
}
