import { get } from "lodash";
import { IdParams } from "../../../../../../models/Common.model";
import { notFound } from "next/navigation";
import SubCategory from "../../../../../../services/SubCategory";
import EditSubCategoryView from "../../../../../../sections/admin/categories/view/subcategory/EditSubCategoryView";

export default async function EditSubCategory({ params }: IdParams) {
    try {
        const response = await SubCategory.findOne(String(params.id));
        const subcategory = get(response, "data", null);

        if (!subcategory) {
            notFound();
        }

        return <EditSubCategoryView subcategory={subcategory} />;
    } catch (error) {
        notFound();
    }
}
