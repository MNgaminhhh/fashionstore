import Link from "next/link";
import { styled } from "@mui/material/styles";

export const StyledLink = styled(Link, {
    shouldForwardProp: (prop) => prop !== "active",
})<{ active: number }>(({ theme, active }) => ({
    position: "relative",
    transition: "color 150ms ease-in-out",
    color: active ? theme.palette.primary.main : "inherit",
    "&:hover": { color: `${theme.palette.primary.main} !important` },
}));