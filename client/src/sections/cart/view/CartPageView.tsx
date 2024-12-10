"use client";

import Grid from "@mui/material/Grid";
import useCart from "../../../hooks/useCart";
import CheckoutForm from "../components/CheckoutForm";
import CartItem from "../components/CartItem";

export default function CartPageView() {
  const { state } = useCart();
  console.log(state);

  return (
    <Grid container spacing={3}>
      <Grid item md={8} xs={12}>
        {state.cart.map((item) => (
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
          />
        ))}
      </Grid>
      <Grid item md={4} xs={12}>
        <CheckoutForm />
      </Grid>
    </Grid>
  );
}
