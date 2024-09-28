import { Box, BoxProps } from "@mui/material";
import { FC, ReactNode } from "react";

interface FlexBetweenProp extends BoxProps {
    children: ReactNode;
}

const FlexBetween: FC<FlexBetweenProp> = ({ children, ...props }) => (
    <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        {...props}
    >
        {children}
    </Box>
);

export default FlexBetween;
