import { Box, BoxProps } from "@mui/material";

export default function FlexBox({ children, ...props }: BoxProps) {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            {...props}
        >
            {children}
        </Box>
    );
}
