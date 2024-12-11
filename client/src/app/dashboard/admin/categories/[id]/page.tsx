import { get } from "lodash";
import { IdParams } from "../../../../../models/Common.model";
import { notFound } from "next/navigation";
import Categories from "../../../../../services/Categories";
import EditCategoriesView from "../../../../../sections/admin/categories/view/EditCategoriesView";
export default async function EditCreategories({ params }: IdParams) {
    try {
        const cat = await Categories.findOne(String(params.id));
        const info = get(cat, "data", {});
        return <EditCategoriesView category={info} />;
    } catch (error) {
        notFound();
    }
}
