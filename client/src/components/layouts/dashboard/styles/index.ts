import { styled } from "@mui/material/styles";
const RootStyle = styled("div", {
    shouldForwardProp: (prop) => prop !== "compact"
})<{ compact: boolean }>(({ theme, compact }) => ({
    transition: "margin-left 0.3s",
    marginLeft: compact ? 86 : 280,
    [theme.breakpoints.down("lg")]: { marginLeft: 0 }
}));

export default RootStyle;
