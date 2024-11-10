import { Open_Sans } from "next/font/google";
import "./globals.css";
import React from "react";
import { Toaster } from "react-hot-toast";
import AppProvider from "../context/AppContext";
import { cookies } from "next/headers";
import ThemeProvider from "../theme/ThemeProvider";
import CartProvider from "../context/CartContext";

export const inter = Open_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Trang Chủ | MTSHOP",
  description: "MTSHOP-ecommerce",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("access_cookie");
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <CartProvider>
          <ThemeProvider>
            <AppProvider initialToken={sessionToken?.value}>
              <Toaster />
              {children}
            </AppProvider>
          </ThemeProvider>
        </CartProvider>
      </body>
    </html>
  );
}
