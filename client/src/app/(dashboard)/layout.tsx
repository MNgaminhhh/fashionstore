import { PropsWithChildren } from "react";
import { DashboardLayout } from "../../components/layouts/dashboard";
const Layout = ({ children }: PropsWithChildren) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default Layout;
