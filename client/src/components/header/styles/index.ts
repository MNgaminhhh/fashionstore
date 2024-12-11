import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import {constant} from "../../../utils/constants";

export const HeaderWrapper = styled("div")(({ theme }) => ({
    zIndex: 3,
    position: "relative",
    height: constant.headerHeight,
    transition: "height 250ms ease-in-out",
    background: theme.palette.common.black,
    [theme.breakpoints.down("sm")]: {
        height: constant.mobileHeaderHeight,
    },
}));

export const StyledContainer = styled(Container)(() => ({
    gap: 2,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
}));
