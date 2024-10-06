"use client";
import Card, { CardProps } from "@mui/material/Card";
import { styled } from "@mui/material/styles";

interface MTCardProps extends CardProps {
    isHover?: boolean;
}
export const MTCard = styled(Card, {
    shouldForwardProp: (prop) => prop !== "isHover",
})<MTCardProps>(({ theme, isHover }) => ({
    overflow: "unset",
    borderRadius: "8px",
    transition: "box-shadow 250ms ease-in-out, transform 250ms ease-in-out",
    ...(isHover && {
        "&:hover": {
            boxShadow: theme.shadows[3],
            transform: "translateY(-2px)",
        },
    }),
}));
