import { PropsWithChildren, memo } from "react";
import Drawer from "@mui/material/Drawer";
import {StyledWrapper} from "./styles";

interface DrawerLayoutProps extends PropsWithChildren {
    open: boolean;
    onClose: () => void;
    widthDrawer?: number;
}
const DrawerLayout = ({ children, open, onClose, widthDrawer = 280 }: DrawerLayoutProps) => {
    return (
        <Drawer
            open={open}
            anchor="left"
            onClose={onClose}
            PaperProps={{ sx: { width: widthDrawer } }}
        >
            <StyledWrapper>{children}</StyledWrapper>
        </Drawer>
    );
};

export default memo(DrawerLayout);
