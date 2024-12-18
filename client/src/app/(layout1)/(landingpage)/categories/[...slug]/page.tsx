import { Metadata } from "next";
import { get } from "lodash";
import { notFound } from "next/navigation";
import Products from "../../../../../services/Products";
import ProductSearchPageView from "../../../../../sections/product-detail/view/ProductSearchPageView";

export const metadata: Metadata = {
  title: "Tất Cả Sản Phẩm | MTShop",
  description: "Tất Cả Sản Phẩm trong MTShop",
  keywords: ["e-commerce", "MTShop"],
};

interface ProductSearchProps {
  params: {
    slug: string[];
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function ProductSearch({
  params,
  searchParams,
}: ProductSearchProps) {
  try {
    const { slug } = params;
    const requestParams: { [key: string]: string | string[] } = {};

    Object.keys(searchParams).forEach((key) => {
      const value = searchParams[key];
      if (typeof value === "string" || Array.isArray(value)) {
        requestParams[key] = value;
      }
    });
    if (slug.length > 0) {
      requestParams.slug_cate = slug[0];
    }
    if (slug.length > 1) {
      requestParams.slug_sub_cate = slug[1];
    }
    if (slug.length > 2) {
      requestParams.slug_child_cate = slug[2];
    }
    const productResponse = await Products.getAllProduct(100, 1, requestParams);
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
}
