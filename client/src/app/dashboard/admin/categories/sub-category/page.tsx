import {cookies} from "next/headers";
import {get} from "lodash";
import SubCategory from "../../../../../services/SubCategory";
import SubCategoryView from "../../../../../sections/admin/categories/view/subcategory/SubCategoryView";
export default async function SubCategoriesPage() {
    const cookieStore = cookies();
    const token = cookieStore.get("access_cookie")?.value;
    const listCat = await SubCategory.findAll(token);
    const infoCats = get(listCat, "data", {});
    return <SubCategoryView subcategories={infoCats} token={token}/>;
}
