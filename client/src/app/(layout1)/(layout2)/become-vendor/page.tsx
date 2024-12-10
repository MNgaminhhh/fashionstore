import { Metadata } from "next";
import { Container } from "@mui/material";
import BecomeVendorPage from "../../../../sections/vendor/become/view/BecomeVendorPage";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Trở Thành Nhà Bán Hàng | MTShop",
  description: `Trở Thành Nhà Bán Hàng của MTShop`,
  keywords: ["e-commerce", "MTShop"],
};

export default function BecomeVendor() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <BecomeVendorPage token={token} />
    </Container>
  );
}
