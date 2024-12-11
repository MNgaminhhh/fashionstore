import { Metadata } from "next";
import { get } from "lodash";
import { notFound } from "next/navigation";
import FlashSale from "../../../services/FlashSale";
import ProductSearchPageView from "../../../sections/product-detail/view/ProductSearchPageView";

export const metadata: Metadata = {
  title: "Tất Cả Sản Phẩm Flash Sale| MTShop",
  description: "Tất Cả Sản Phẩm Flash Sale trong MTShop",
  keywords: ["e-commerce", "MTShop"],
};
const ProductSearch = async () => {
  try {
    const productResponse = await FlashSale.getFlashDeals(10, 1);
    const initialProducts = get(productResponse, "data", []);

    return (
      <ProductSearchPageView
        initialProducts={initialProducts}
        showfilter={false}
        title="Các sản phẩm Flash Sale"
      />
    );
  } catch (error) {
    notFound();
  }
};

export default ProductSearch;
