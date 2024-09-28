import { Box, BoxProps } from "@mui/material";
import { FC, ReactNode } from "react";

interface FlexBoxProp extends BoxProps {
    children: ReactNode;
}

const FlexBox: FC<FlexBoxProp> = ({children, ...props }) => (
    <Box display="flex" {...props}>
        {children}
    </Box>
);

export default FlexBox;
