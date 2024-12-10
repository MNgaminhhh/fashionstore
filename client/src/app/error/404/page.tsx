import { Metadata } from "next";
import NotFoundPageView from "../../../sections/error/NotFoundView";

export const metadata: Metadata = {
  title: "404 Không Tìm thấy Trang | MTShop",
  description: "Không Tìm thấy Trang MTShop",
};

export default function NotFound() {
  return <NotFoundPageView />;
}
