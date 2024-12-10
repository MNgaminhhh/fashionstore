import { Metadata } from "next";
import { CartPageView } from "../../../../sections/cart/view";

export const metadata: Metadata = {
  title: "Giỏ Hàng | MTShop",
  description: `Giỏ hàng của MTShop`,
  keywords: ["e-commerce", "MTShop"],
};

export default function Cart() {
  return <CartPageView />;
}
