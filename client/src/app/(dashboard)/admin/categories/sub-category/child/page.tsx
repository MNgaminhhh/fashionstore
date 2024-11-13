import {cookies} from "next/headers";
import {get} from "lodash";
import ChildCategory from "../../../../../../services/ChildCategory";
import ChildCategoryView
    from "../../../../../../sections/admin/categories/view/subcategory/childcategory/ChildCategoryView";
export default async function ChildCategoriesPage() {
    const cookieStore = cookies();
    const token = cookieStore.get("access_cookie")?.value;
    const listCat = await ChildCategory.findAll(token);
    const infoCats = get(listCat, "data", {});
    return <ChildCategoryView childCategories={infoCats} token={token}/>;
}
