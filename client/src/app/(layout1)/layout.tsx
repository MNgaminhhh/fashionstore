import { PropsWithChildren } from "react";
import MainLayout from "../../components/layouts/components/main/MainLayout";

export default function Layout1({ children }: PropsWithChildren) {
    return <MainLayout>{children}</MainLayout>;
}
