import { Box, BoxProps } from "@mui/material";
import {ReactNode} from "react";

interface FlexCenterRowProps {
    children: ReactNode;
}
export default function FlexCenterRow({ children, ...props }: FlexCenterRowProps) {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            {...props}
        >
            {children}
        </Box>
    );
}
