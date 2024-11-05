import { PropsWithChildren } from "react";
import { H3 } from "../components/Typography";
import { Divider, Box } from "@mui/material";

interface Props extends PropsWithChildren {
  title: string;
}

export default function WrapperPage({ children, title }: Props) {
  return (
    <Box sx={{ paddingTop: 1, paddingBottom: 6 }}>
      <H3 mb={2}>{title}</H3>
      <Divider sx={{ mb: 2 }} />
      {children}
    </Box>
  );
}
