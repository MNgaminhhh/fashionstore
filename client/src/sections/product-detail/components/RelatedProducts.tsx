"use client";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ProductModel from "../../../models/Product.model";
import { H3 } from "../../../components/Typography";
import { Typography } from "@mui/material";
import CardProduct1 from "../../../components/card/productcard1/CardProduct";
type Props = { products: ProductModel[] };

export default function RelatedProducts({ products }: Props) {
  return (
    <Box mt={2} mb={7.5}>
      <H3 mb={3}>Sản phẩm liên quan:</H3>

      {products && products.length > 0 ? (
        <Grid container spacing={3}>
          {products.map((item) => {
            const highestPrice = Number(item.highest_price);
            const lowestPrice = Number(item.lowest_price);

            const discount =
              highestPrice > 0 && highestPrice >= lowestPrice
                ? ((highestPrice - lowestPrice) / highestPrice) * 100
                : 0;
            return (
              <Grid item lg={3} md={4} sm={6} xs={12} key={item.id}>
                <CardProduct1
                  hoverEffect
                  id={item.id}
                  slug={item.slug}
                  title={item.name}
                  price={Number(item.highest_price)}
                  imgUrl={item.images}
                  rating={item.review_point}
                  discount={Math.round(discount)}
                  discountPrice={item.lowest_price}
                />
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Box mt={2}>
          <Typography variant="body1" color="textSecondary" align="center">
            Không có sản phẩm liên quan nào khác.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
