import Container from "@mui/material/Container";
import ProductModel from "../../../models/Product.model";
import ProductIntro from "../components/ProductIntro";
import RelatedProducts from "../components/RelatedProducts";
import ProductTabs from "../components/ProductTabs";
import { Divider } from "@mui/material";

interface Props {
  product: any;
  relatedProducts: ProductModel[];
}

export default function ProductDetailsView(props: Props) {
  return (
    <Container className="mt-2 mb-2">
      <ProductIntro product={props.product} />

      <Divider sx={{ borderColor: "grey.300" }} />
      <ProductTabs
        product={props.product}
        vendor={props.product.vendor}
        reviews={props.product.reviews}
      />
      <Divider sx={{ my: 4, borderColor: "grey.300" }} />

      <RelatedProducts products={props.relatedProducts} />
    </Container>
  );
}
