import { styled } from "@mui/material/styles";
import { FlexBox } from "../../flexbox";

export const StyledAccordion = styled(FlexBox, {
    shouldForwardProp: (prop) => prop !== "open"
})<{ open: number }>(({ open, theme }) => ({
    padding: ".5rem 1rem",
    alignItems: "center",
    justifyContent: "space-between",
    ".accor": {
        transition: "transform 200ms ease-in-out",
        transform: `rotate(${open ? "90deg" : "0deg"})`,
        ...(theme.direction === "rtl" && {
            transform: `rotate(${open ? "90deg" : "180deg"})`
        })
    }
}));
