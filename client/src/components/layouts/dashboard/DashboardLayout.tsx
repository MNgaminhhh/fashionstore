'use client'
import { PropsWithChildren } from "react";
import Container from "@mui/material/Container";
import { LayoutProvider } from "./context/LayoutContext";
import BodyWrapper from "./components/BodyWrapper";
import SidebarDashboard from "./components/sidebar/SideBar";
import NavbarDashboard from "./components/navbar/NavBar";

export default function DashboardLayout({ children }: PropsWithChildren) {


  return (
    <LayoutProvider>
      <SidebarDashboard/>
      <BodyWrapper>
        <NavbarDashboard />
        <Container maxWidth="lg">{children}</Container>
      </BodyWrapper>
    </LayoutProvider>
  );
}
