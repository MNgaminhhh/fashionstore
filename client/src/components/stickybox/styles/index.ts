import { keyframes, styled } from "@mui/material/styles";

interface Props {
    fixed?: boolean;
    fixedOn?: number;
    componentHeight?: number;
}
const slideDown = keyframes`
    from {transform: translateY(-200%)}
    to {transform: translateY(0)}
`;

export const StyledBox = styled("div", {
    shouldForwardProp: (prop) => prop !== "componentHeight" && prop !== "fixed" && prop !== "fixedOn"
})<Props>(({ theme, componentHeight, fixedOn, fixed }) => ({
    paddingTop: fixed ? componentHeight : 0,

    "& .hold": {
        zIndex: 5,
        boxShadow: "none",
        position: "relative"
    },

    "& .fixed": {
        left: 0,
        right: 0,
        zIndex: 5000,
        position: "fixed",
        top: `${fixedOn}px`,
        boxShadow: theme.shadows[2],
        transition: "all 200ms ease-in-out",
        animation: `${slideDown} 300ms ${theme.transitions.easing.easeInOut}`
    }
}));
