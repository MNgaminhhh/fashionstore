import { notFound } from "next/navigation";
import EditProductView from "../../../../../sections/vendor/product/view/EditProductView";
import { IdParams } from "../../../../../models/Common.model";
import Products from "../../../../../services/Products";
import { get } from "lodash";

export default async function EditProduct({ params }: IdParams) {
  try {
    const product = await Products.findOne(String(params.id));
    const infoPro = get(product, "data.data", {});
    return <EditProductView product={infoPro} />;
  } catch (error) {
    notFound();
  }
}
