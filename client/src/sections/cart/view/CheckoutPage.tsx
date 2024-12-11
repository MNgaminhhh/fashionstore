"use client";

import { Box, Divider, Grid } from "@mui/material";
import useCart from "../../../hooks/useCart";
import CheckoutForm from "../components/CheckoutForm";
import { formatCurrency } from "../../../utils/lib";
import CartItem from "../components/CartItem";
import { H3, H4 } from "../../../components/Typography";

export default function CheckoutPage() {
  const { state } = useCart();
  const selectedItems = state.cart.filter((item) => item.selected);

  return (
    <Box sx={{ padding: { xs: 2, md: 4 } }}>
      <H3>Thanh toán</H3>

      {selectedItems.length === 0 ? (
        <H4 color="text.secondary">
          Không có sản phẩm nào được chọn để thanh toán.
        </H4>
      ) : (
        <Grid container spacing={3}>
          <Grid item md={8} xs={12}>
            {selectedItems.map((item) => (
              <CartItem
                key={item.id}
                id={item.id}
                skuId={item.sku_id}
                quantity={item.quantity}
                price={item.price}
                offerPrice={item.offer_price}
                totalPrice={item.total_price}
                totalOfferPrice={item.total_offer_price}
                productImages={item.product_image}
                banner={item.banner}
                productName={item.product_name}
                variantImage={item.variant_image}
                storeName={item.store_name}
                selected={item.selected}
                readOnly={true}
              />
            ))}
          </Grid>
          <Grid item md={4} xs={12}>
            <CheckoutForm status={true} />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
