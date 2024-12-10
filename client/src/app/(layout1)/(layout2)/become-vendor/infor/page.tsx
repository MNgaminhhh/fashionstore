import { Metadata } from "next";
import { Container } from "@mui/material";
import BecomeInforPage from "../../../../../sections/vendor/become/view/BecomeInforPage";

export const metadata: Metadata = {
  title: "Thông Tin Cần Thiết KhiTrở Thành Nhà Bán Hàng | MTShop",
  description: `Thông Tin Cần Thiết KhiTrở Thành Nhà Bán Hàng của MTShop`,
  keywords: ["e-commerce", "MTShop"],
};

export default function BecomeVendor() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <BecomeInforPage />
    </Container>
  );
}
