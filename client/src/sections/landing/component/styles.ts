import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import styled from "@mui/material/styles/styled";
import {FlexCenterRow} from "../../../components/flexbox";
import Scrollbar from "../../../components/scrollbar";
import {H5} from "../../../components/Typography";

type Selected = { selected: number };
export const CategoryBoxWrapper = styled(FlexCenterRow, {
    shouldForwardProp: (prop) => prop !== "selected"
})<Selected>(({ selected, theme }) => ({
    flex: "1 1 0",
    height: "175px",
    margin: "0.75rem",
    minWidth: "200px",
    cursor: "pointer",
    borderRadius: "8px",
    position: "relative",
    flexDirection: "column",
    transition: "all 250ms ease-in-out",
    border: `1px solid ${theme.palette.grey[400]}`,
    background: selected ? "white" : "transparent"
}));

export const StyledChip = styled(Chip, {
    shouldForwardProp: (prop) => prop !== "selected"
})<Selected>(({ selected, theme }) => ({
    top: "1rem",
    right: "1rem",
    fontWeight: 600,
    fontSize: "10px",
    padding: "5px 10px",
    position: "absolute",
    color: selected ? "white" : "inherit",
    boxShadow: selected ? "0px 8px 20px -5px rgba(255, 103, 128, 0.9)" : "inherit",
    backgroundColor: selected ? theme.palette.primary.main : theme.palette.grey[300]
}));

export const CategoryWrapper = styled(Box, {
    shouldForwardProp: (prop) => prop !== "show"
})<{ show: number }>(({ show, theme }) => ({
    left: 0,
    zIndex: 99,
    width: "100%",
    position: "fixed",
    top: show ? 0 : -90,
    boxShadow: theme.shadows[2],
    transition: "top 0.3s ease-in-out"
}));

export const StyledScrollbar = styled(Scrollbar)({
    "& .simplebar-content": {
        height: "5rem",
        display: "flex",
        backgroundColor: "white",
        justifyContent: "center"
    }
});

export const Title = styled(H5, {
    shouldForwardProp: (prop) => prop !== "selected"
})<Selected>(({ selected, theme }) => ({
    fontSize: 12,
    textAlign: "center",
    fontWeight: selected ? "600" : "400",
    color: selected ? theme.palette.primary.main : "inherit"
}));
