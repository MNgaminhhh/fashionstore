import { PropsWithChildren } from "react";
import { H3, H4 } from "../components/Typography";
import { Divider, Box, Typography } from "@mui/material";
import { themeColors } from "../theme/ThemeColors";

interface Props extends PropsWithChildren {
  title: string;
  title2?: string;
}

export default function WrapperPage({ children, title, title2 }: Props) {
  return (
    <Box sx={{ paddingTop: 1, paddingBottom: 6 }}>
      <H3 mb={1}>{title}</H3>
      {title2 && (
        <Typography
          variant="subtitle1"
          color="textSecondary"
          sx={{
            mb: 2,
            textTransform: "capitalize",
          }}
        >
          {title2}
        </Typography>
      )}

      <Divider sx={{ mb: 2 }} />
      {children}
    </Box>
  );
}
