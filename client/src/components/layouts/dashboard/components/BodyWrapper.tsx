import { PropsWithChildren } from "react";
import RootStyle from "../styles";
import {useLayout} from "../context/LayoutContext";

export default function BodyWrapper({ children }: PropsWithChildren) {
    const { sidebarCompact } = useLayout();

    return <RootStyle compact={sidebarCompact}>{children}</RootStyle>;
}
