import CategoriesView from "../../../../sections/admin/categories/view/CategoriesView";
import Categories from "../../../../services/Categories";
import {cookies} from "next/headers";
import {get} from "lodash";
export default async function CategoriesPage() {
    const cookieStore = cookies();
    const token = cookieStore.get("access_cookie")?.value;
    const listCat = await Categories.findAll(token);
    const infoCats = get(listCat, "data", {});
    return <CategoriesView categories={infoCats} token={token}/>;
}
