import {Open_Sans} from "next/font/google";
import "./globals.css";
import React from "react";

export const inter = Open_Sans({ subsets: ["latin"] });

export const metadata = {
    title: "Trang Chủ | MTSHOP",
    description: "MTSHOP-ecommerce",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning >
            <body className={inter.className}>
                {children}
            </body>
        </html>
    );
}
