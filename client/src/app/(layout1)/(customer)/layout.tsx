import { PropsWithChildren } from "react";
import CustomerLayout from "../../../components/layouts/customer/layout";

export default function Layout({ children }: PropsWithChildren) {
    return <CustomerLayout>{children}</CustomerLayout>;
}
