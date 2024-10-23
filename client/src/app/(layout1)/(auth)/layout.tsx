import { PropsWithChildren } from "react";
import AuthLayout from "../../../sections/auth/layout";

export default function Layout({ children }: PropsWithChildren) {
    return (
        <AuthLayout>
            {children}
        </AuthLayout>
    );
}
