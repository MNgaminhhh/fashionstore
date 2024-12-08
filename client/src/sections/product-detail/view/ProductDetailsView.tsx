import Container from "@mui/material/Container";
// import ProductTabs from "../product-tabs";
// import RelatedProducts from "../related-products";
import ProductModel from "../../../models/Product.model";
import ProductIntro from "../components/ProductIntro";

interface Props {
  product: ProductModel;
  relatedProducts: ProductModel[];
}

export default function ProductDetailsView(props: Props) {
  return (
    <Container className="mt-2 mb-2">
      <ProductIntro product={props.product} />

      {/* PRODUCT DESCRIPTION AND REVIEW */}
      {/* <ProductTabs />

      {/* RELATED PRODUCTS AREA */}
      {/* <RelatedProducts products={props.relatedProducts} /> */} */}
    </Container>
  );
}
