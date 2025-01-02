import { Metadata } from "next";
import { get } from "lodash";
import Products from "../../../../services/Products";
import ProductSearchPageView from "../../../../sections/product-detail/view/ProductSearchPageView";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Tất Cả Sản Phẩm | MTShop",
  description: "Tất Cả Sản Phẩm trong MTShop",
  keywords: ["e-commerce", "MTShop"],
};

interface CategoriesSearchProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const CategoriesSearch = async ({ searchParams }: CategoriesSearchProps) => {
  try {
    const params: { [key: string]: string | string[] } = {};
    Object.keys(searchParams).forEach((key) => {
      const value = searchParams[key];
      if (typeof value === "string" || Array.isArray(value)) {
        params[key] = value;
      }
    });
    const productResponse = await Products.getAllProduct(100, 1, params);
    const initialProducts = get(productResponse, "data.data", []);

    return (
      <ProductSearchPageView
        initialProducts={initialProducts}
        title="Tất Cả Sản Phẩm"
        showfilter
      />
    );
  } catch (error) {
    notFound();
  }
};

export default CategoriesSearch;
