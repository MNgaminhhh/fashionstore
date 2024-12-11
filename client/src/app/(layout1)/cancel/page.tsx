import { Metadata } from "next";
import { Container } from "@mui/material";
import CancelPage from "../../../sections/cart/view/CancelPage";

export const metadata: Metadata = {
  title: "Hủy Đơn Hàng | MTShop",
  description: `Hủy Đơn Hàng của MTShop`,
  keywords: ["e-commerce", "MTShop"],
};

export default function Checkout() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <CancelPage />
    </Container>
  );
}
