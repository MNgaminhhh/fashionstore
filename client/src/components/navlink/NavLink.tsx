import { styled } from "@mui/material";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { CSSProperties, ReactNode } from "react";

interface NavLinkProps {
    href: string;
    children: ReactNode;
    style?: CSSProperties;
    className?: string;
}

const StyledLink = styled("a")<{ active_route: string }>(({ theme, active_route }) => ({
    position: "relative",
    transition: "color 150ms ease-in-out",
    color: active_route === "active" ? theme.palette.primary.main : "inherit",
    "&:hover": {
        color: `${theme.palette.primary.main} !important`,
    },
}));

const NavLink: React.FC<NavLinkProps> = ({ href, children, style, className, ...props }) => {
    const { pathname } = useRouter();

    const checkRouteMatch = () => {
        if (href === "/") return pathname === href;
        return pathname.includes(href);
    };

    const currentRoute = checkRouteMatch();

    return (
        <Link href={href} passHref>
            <StyledLink
                style={style}
                className={clsx(className)}
                active_route={currentRoute ? "active" : ""}
                {...props}
            >
                {children}
            </StyledLink>
        </Link>
    );
};

export default NavLink;
