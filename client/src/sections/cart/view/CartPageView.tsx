"use client";

import Grid from "@mui/material/Grid";
import useCart from "../../../hooks/useCart";
import CheckoutForm from "../components/CheckoutForm";
import CartItem from "../components/CartItem";
import { Checkbox, FormControlLabel, Box, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { H3, H4 } from "../../../components/Typography";

export default function CartPageView() {
  const { state, selectAll } = useCart();
  const [isAllSelected, setIsAllSelected] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const allSelected =
      state.cart.length > 0 && state.cart.every((item) => item.selected);
    setIsAllSelected(allSelected);
  }, [state.cart]);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setIsAllSelected(checked);
    selectAll(checked);
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <Box sx={{ padding: { xs: 2, md: 4 } }}>
      <H3 variant="h4" gutterBottom>
        Giỏ hàng của bạn
      </H3>
      <Grid container spacing={3}>
        <Grid item md={8} xs={12}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  color="primary"
                />
              }
              label="Chọn tất cả"
            />
          </Box>
          {state.cart.length === 0 ? (
            <H3 variant="h6" color="text.secondary">
              Giỏ hàng của bạn đang trống.
            </H3>
          ) : (
            state.cart.map((item) => (
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
                selected={item.selected || false}
              />
            ))
          )}
        </Grid>
        <Grid item md={4} xs={12}>
          <CheckoutForm />
        </Grid>
      </Grid>
    </Box>
  );
}
