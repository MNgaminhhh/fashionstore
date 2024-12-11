"use client";
import Link from "next/link";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";

type IconButtonProps = {
    variant?: "light" | "dark";
    backgroundColor?: string;
};
type LinkProps = { isDark?: boolean };
export const StyledIconButton = styled(IconButton, {
    shouldForwardProp: (prop) => prop !== "variant" && prop !== "backgroundColor",
})<IconButtonProps>(({ variant, backgroundColor, theme }) => ({
    margin: 4,
    fontSize: 12,
    padding: "10px",
    backgroundColor: backgroundColor || "rgba(0,0,0,0.2)",
    ":hover": {
        backgroundColor: backgroundColor
            ? `${backgroundColor}AA`
            : "rgba(255,255,255,0.4)",
    },
    ".icon": {
        color: "white",
    },
}));

export const StyledLink = styled(Link, {
    shouldForwardProp: (prop) => prop !== "isDark",
})<LinkProps>(({ theme, isDark }) => ({
    fontSize: "14px",
    borderRadius: 4,
    display: "block",
    cursor: "pointer",
    position: "relative",
    padding: "0.3rem 0",
    color: isDark ? theme.palette.grey[100] : theme.palette.grey[500],
    "&:hover": {
        color: isDark ? theme.palette.grey[300] : theme.palette.grey[100],
    },
}));

export const StyledRoot = styled("footer")(({ theme }) => ({
    padding: "40px",
    color: "white",
    borderRadius: "8px",
    backgroundColor: theme.palette.primary[600],
    [theme.breakpoints.down("md")]: {
        marginBottom: "6rem !important",
    },
}));

export const Heading = styled("h6")({
    fontSize: "18px",
    lineHeight: 1.2,
    fontWeight: 600,
    marginBottom: "12px",
});
