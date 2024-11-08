import { PropsWithChildren } from "react";
import RootStyle from "../styles";
import { useLayout } from "../context/LayoutContext";

export default function BodyWrapper({ children }: PropsWithChildren) {
  const { isSidebarCompact } = useLayout();

  return <RootStyle compact={isSidebarCompact}>{children}</RootStyle>;
}
