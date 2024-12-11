import { Menu, MenuProps } from "@mui/material";
import { Fragment, useState, ReactNode } from "react";
import { SxProps, Theme } from "@mui/material/styles";

interface MTMenuProps extends Omit<MenuProps, "open"> {
  open?: boolean;
  sx?: SxProps<Theme>;
  handler: (e: any) => ReactNode;
  options: (e: () => void) => ReactNode;
  direction?: "left" | "right" | "center";
}

export default function MTMenu({
  open,
  handler,
  options,
  direction = "left",
  ...props
}: MTMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleOnClick = (event: any) => setAnchorEl(event.currentTarget);
  const handleOnClose = () => setAnchorEl(null);
  const isOpen = open !== undefined ? open : !!anchorEl;
  const origin = { vertical: "bottom" as const, horizontal: direction };
  const transform = { vertical: "top" as const, horizontal: direction };
  return (
    <Fragment>
      {handler && handler(handleOnClick)}
      <Menu
        anchorEl={anchorEl}
        onClose={handleOnClose}
        open={isOpen}
        anchorOrigin={origin}
        transformOrigin={transform}
        elevation={0}
        {...props}
      >
        {options(handleOnClose)}
      </Menu>
    </Fragment>
  );
}
