"use client";
import { usePathname } from "next/navigation";
import { AnchorHTMLAttributes, CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import { StyledLink } from "./styles";
import { SxProps, Theme } from "@mui/material/styles";

export interface NavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
  sx?: SxProps<Theme>;
}

export default function NavLink({
  href,
  children,
  style,
  className,
  sx,
  ...props
}: NavLinkProps) {
  const pathName = usePathname();
  const checkRoute = (): boolean => {
    if (href === "/") return pathName === href;
    return pathName.includes(href);
  };

  return (
    <StyledLink
      href={href}
      style={style}
      className={clsx(className)}
      active={checkRoute() ? 1 : 0}
      sx={sx}
      {...props}
    >
      {children}
    </StyledLink>
  );
}
