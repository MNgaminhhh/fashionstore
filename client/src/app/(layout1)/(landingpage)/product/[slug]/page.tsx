import { Metadata } from "next";
import { notFound } from "next/navigation";
import Products from "../../../../../services/Products";
import { get } from "lodash";
import ProductDetailsView from "../../../../../sections/product-detail/view/ProductDetailsView";

export async function generateMetadata({ params }): Promise<Metadata> {
  try {
    const product = await Products.getDetailProduct(params.slug as string);
    const infoPro = get(product, "data", {});
    const productName = infoPro.name || "Chi tiết sản Phẩm";

    return {
      title: `${productName} | MTShop`,
      description: `Chi tiết của sản phẩm ${productName} tại MTShop.`,
      keywords: ["e-commerce", "MTShop", productName],
    };
  } catch (error) {
    return {
      title: "Sản Phẩm Không Tìm Thấy | MTShop",
      description: `Sản phẩm bạn tìm kiếm không tồn tại tại MTShop.`,
      keywords: ["e-commerce", "MTShop"],
    };
  }
}

export default async function ProductDetails({ params }) {
  try {
    //get product
    const product = await Products.getDetailProduct(params.slug as string);
    const infoPro = get(product, "data", {});

    //get related product
    const cateName = infoPro.category_name || "";
    const filters = { cate_name: cateName };
    const reProduct = await Products.getAllProduct(10, 1, filters);
    const infoReProduct = get(reProduct, "data.data.products", {});
    //get review

    return (
      <ProductDetailsView product={infoPro} relatedProducts={infoReProduct} />
    );
  } catch (error) {
    notFound();
  }
}
