import { Box, BoxProps } from "@mui/material";
import { FC, ReactNode } from "react";

interface FlexRowCenterProp extends BoxProps {
    children: ReactNode;
}

const FlexCenterRow: FC<FlexRowCenterProp> = ({ children, ...props }) => (
    <Box display="flex" justifyContent="center" alignItems="center" {...props}>
        {children}
    </Box>
);

export default FlexCenterRow;
