import { useEffect, useState, ReactNode } from "react";
import Drawer from "@mui/material/Drawer";
import Scrollbar from "../scrollbar";

interface SideNavProps {
    open?: boolean;
    width?: number;
    children: ReactNode;
    toggle?: () => void;
    position?: "left" | "right";
    handler: (event: () => void) => ReactNode;
}

export default function SideNav(props: SideNavProps) {
    const { position = "left", open = false, width = 280, children, handler, toggle } = props;

    const [sideNavOpen, setSideNavOpen] = useState(open);
    const toggleSideNav = () => setSideNavOpen(!sideNavOpen);
    useEffect(() => setSideNavOpen(open), [open]);
    const handleClose = toggle || toggleSideNav;

    return (
        <div>
            <Drawer
                anchor={position}
                open={sideNavOpen}
                onClose={handleClose}
                SlideProps={{ style: { width } }}
                sx={{ zIndex: 15001 }}
            >
                <Scrollbar autoHide={false}>{children}</Scrollbar>
            </Drawer>
            {handler(handleClose)}
        </div>
    );
}
