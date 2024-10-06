import { styled } from "@mui/material/styles";

export const StyledWrapper = styled("div", {
    shouldForwardProp: (prop) => prop !== "open"
})<{ open: boolean }>(({ open, theme: { direction } }) => ({
    cursor: "pointer",
    position: "relative",
    "& .dropdown-icon": {
        transition: "all 250ms ease-in-out",
        transform: `rotate(${open ? "90deg" : "0deg"})`
    }
}));
