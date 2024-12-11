import { Box, BoxProps } from "@mui/material";
import { ReactNode } from "react";

interface FlexBoxProps extends BoxProps {
  children: ReactNode;
}

export default function FlexBox({ children, ...props }: FlexBoxProps) {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" {...props}>
      {children}
    </Box>
  );
}
