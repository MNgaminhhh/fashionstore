import { get } from "lodash";
import { IdParams } from "../../../../../../../models/Common.model";
import { notFound } from "next/navigation";
import EditChildCategoryView
    from "../../../../../../../sections/admin/categories/view/subcategory/childcategory/EditChildCategoryView";
import ChildCategory from "../../../../../../../services/ChildCategory";

export default async function EditChildCategory({ params }: IdParams) {
    try {
        const response = await ChildCategory.findOne(String(params.id));
        const childCategory = get(response, "data", null);

        if (!childCategory) {
            notFound();
        }

        return <EditChildCategoryView childCategory={childCategory} />;
    } catch (error) {
        notFound();
    }
}
