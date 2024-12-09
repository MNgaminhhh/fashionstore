import { Fragment } from "react";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";
import ProductModel from "../../../models/Product.model";
import { FlexBetween } from "../../../components/flexbox";
import { Span } from "../../../components/Typography";
import CardProduct2 from "../../../components/card/productcard1/CardProduct2";

type Props = { products: any };

export default function ProductsGridView({ products }: Props) {
  if (!Array.isArray(products.products)) {
    return <Span color="error">Invalid product data</Span>;
  }

  const totalProducts = products.total_pages;
  const itemsPerPage = 1;
  const pageCount = Math.ceil(totalProducts / itemsPerPage);

  return (
    <Fragment>
      <Grid container spacing={3}>
        {products.products.length === 0 ? (
          <Span color="grey.600">Không tìm thấy sản phẩm</Span>
        ) : (
          products.products.map((item: ProductModel) => (
            <Grid item lg={4} sm={6} xs={12} key={item.id}>
              <CardProduct2 product={item} />
            </Grid>
          ))
        )}
      </Grid>

      {totalProducts > 0 && (
        <FlexBetween flexWrap="wrap" mt={6}>
          <Span color="grey.600">
            Showing 1-{Math.min(itemsPerPage, totalProducts)} of {totalProducts}{" "}
            Products
          </Span>
          <Pagination count={pageCount} variant="outlined" color="primary" />
        </FlexBetween>
      )}
    </Fragment>
  );
}
