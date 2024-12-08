import { Metadata } from "next";
import { ProductSearchPageView } from "pages-sections/product-details/page-view";

export const metadata: Metadata = {
  title: "Tìm kiếm | MTShop",
  description: `Tìm kiếm trong MTShop`,
  keywords: ["e-commerce", "MTShop", "next.js", "react"],
};

export default async function ProductSearch({ params }) {
  return <ProductSearchPageView />;
}
