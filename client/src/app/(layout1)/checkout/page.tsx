import { Metadata } from "next";
import CheckoutPage from "../../../sections/cart/view/CheckoutPage";
import { Container } from "@mui/material";

export const metadata: Metadata = {
  title: "Thanh Toán | MTShop",
  description: `Thanh Toán của MTShop`,
  keywords: ["e-commerce", "MTShop"],
};

export default function Checkout() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <CheckoutPage />
    </Container>
  );
}
