import { Box, BoxProps } from "@mui/material";
import { ReactNode } from "react";

interface FlexCenterRowProps extends BoxProps {
  children: ReactNode;
}

export default function FlexCenterRow({
  children,
  ...props
}: FlexCenterRowProps) {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" {...props}>
      {children}
    </Box>
  );
}
