import {styled} from "@mui/material/styles";

export const StyledWrapper = styled("div")(({ theme }) => ({
    height: "100%",
    width: "100%",
    position: "fixed",
    overflow: "hidden",
    boxShadow: theme.shadows[1],
    zIndex: theme.zIndex.drawer + 3,
    color: theme.palette.common.white,
    backgroundColor: theme.palette.grey[900],
}));
