import { Open_Sans } from "next/font/google";
import "./globals.css";
import React from "react";
import { Toaster } from "react-hot-toast";
import AppProvider from "../context/AppContext";
import { cookies } from "next/headers";
import ThemeProvider from "../theme/ThemeProvider";
import CartProvider from "../context/CartContext";
import Categories from "../services/Categories";
import { get } from "lodash";
import Cart from "../services/Cart";

export const inter = Open_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Trang Chủ | MTSHOP",
  description: "MTSHOP-ecommerce",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("access_cookie");

  const listCate = await Categories.getFullCate();
  const categories = get(listCate, "data", []);
  const cartCount = await Cart.getAllCart(sessionToken?.value);
  const cartItemCount = cartCount?.data?.length || 0;
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AppProvider
            initialToken={sessionToken?.value}
            initialCategories={categories}
            initialCart={cartItemCount}
          >
            <CartProvider>
              <Toaster />
              {children}
            </CartProvider>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
