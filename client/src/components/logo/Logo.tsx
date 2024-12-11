import { memo } from "react";
import Link from "@mui/material/Link";
import Box, { BoxProps } from "@mui/material/Box";
import Image from "../image";
import RouterLink from "../image/components/RouterLink";

interface LogoProps extends BoxProps {
  single?: boolean;
}

function Logo({ single = false, sx, ...rest }: LogoProps) {
  const logoSrc = single
    ? "/assets/images/logo-compact.svg"
    : "/assets/images/logo.svg";

  return (
    <Link
      component={RouterLink}
      href="/"
      color="inherit"
      aria-label="Go to homepage"
      sx={{ lineHeight: 0, textDecoration: "none" }}
      {...rest}
    >
      <Box
        sx={{
          width: single ? 60 : 120,
          lineHeight: 0,
          cursor: "pointer",
          display: "inline-flex",
          ...sx,
        }}
      >
        <Image
          alt={single ? "MTShop Accounting Logo" : "MTShop Logo"}
          src={logoSrc}
          disabledEffect={true}
          sx={{ width: 120, height: 50 }}
        />
      </Box>
    </Link>
  );
}

export default memo(Logo);
