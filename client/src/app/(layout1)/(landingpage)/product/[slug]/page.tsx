import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailsPageView } from "pages-sections/product-details/page-view";

export const metadata: Metadata = {
  title: "Product Details - Bazaar Next.js E-commerce Template",
  description: `Bazaar is a React Next.js E-commerce template. Build SEO friendly Online store, delivery app and Multi vendor store`,
  authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"],
};

export default async function ProductDetails({ params }) {
  try {
    const product = await api.getProduct(params.slug as string);
    const relatedProducts = await getRelatedProducts();
    const frequentlyBought = await getFrequentlyBought();

    return (
      <ProductDetailsPageView
        product={product}
        relatedProducts={relatedProducts}
        frequentlyBought={frequentlyBought}
      />
    );
  } catch (error) {
    notFound();
  }
}
