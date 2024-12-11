import { SidebarWrapper } from "./styles";
import { useLayout } from "../../context/LayoutContext";
import Logo from "./components/Logo";
import LevelMuiltiMenu from "./components/LevelMuiltiMenu";

export default function SidebarDashboard() {
  const { isSidebarCompact, setSidebarHovered } = useLayout();
  return (
    <SidebarWrapper
      compact={!!isSidebarCompact}
      onMouseEnter={() => setSidebarHovered(true)}
      onMouseLeave={() => isSidebarCompact && setSidebarHovered(false)}
    >
      <Logo />
      <LevelMuiltiMenu/>
    </SidebarWrapper>
  );
}
