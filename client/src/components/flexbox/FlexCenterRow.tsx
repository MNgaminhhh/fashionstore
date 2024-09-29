import { Box, BoxProps } from "@mui/material";

export default function FlexCenterRow({ children, ...props }: BoxProps) {
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
