"use client";

import { PropsWithChildren, useState, useEffect } from "react";
import Container from "@mui/material/Container";
import { LayoutProvider } from "./context/LayoutContext";
import BodyWrapper from "./components/BodyWrapper";
import SidebarDashboard from "./components/sidebar/SideBar";
import NavbarDashboard from "./components/navbar/NavBar";
import { get } from "../../../hooks/useLocalStorage";
import { jwtDecode } from "jwt-decode";

export default function DashboardLayout({ children }: PropsWithChildren) {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = get("token");
    if (token) {
      const decoded = jwtDecode(token);
      setRole(decoded.role);
    }
  }, []);

  return (
    <LayoutProvider>
      <SidebarDashboard role={role} />
      <BodyWrapper>
        <NavbarDashboard />
        <Container maxWidth="lg">{children}</Container>
      </BodyWrapper>
    </LayoutProvider>
  );
}
