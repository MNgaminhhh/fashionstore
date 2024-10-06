import { Box, BoxProps } from "@mui/material";
import {ReactNode} from "react";

interface FlexBetweenProps {
    children: ReactNode;
}
export default function FlexBetween({ children, ...props }: FlexBetweenProps) {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            {...props}
        >
            {children}
        </Box>
    );
}
