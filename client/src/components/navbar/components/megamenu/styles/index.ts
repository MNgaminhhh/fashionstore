import ListItem from "@mui/material/ListItem";
import styled from "@mui/material/styles/styled";
import {NavLink} from "../../../../navlink";
export const StyledWrapper = styled("div")(({ theme }) => ({
    cursor: "pointer",
    position: "relative",
    fontSize: '14px',
    transition: "color 150ms ease-in-out",
    ".icon": {
        fontSize: "1.1rem",
        color: theme.palette.grey[500]
    },
    ":hover": {
        color: theme.palette.primary.main,
        "& .menu-list": { display: "block" }
    }
}));

export const StyledContainer = styled(ListItem, {
    shouldForwardProp: (prop) => prop !== "left" && prop !== "right"
})<{ left: boolean; right: boolean }>(({ theme, left, right }) => ({
    zIndex: 1600,
    top: "100%",
    minWidth: 1000,
    fontSize: '14px',
    display: "none",
    position: "absolute",
    transform: "translate(-50%, 0%)",
    [theme.breakpoints.down(1070)]: { minWidth: 800 },
    ...(left && { transform: "translate(0%, 0%)" }),
    ...(right && { transform: "translate(-80%, 0%)" }),
    ...(left && right && { transform: "translate(-25%, 0%)" })
}));

export const StyledListItem = styled(ListItem)(({ theme }) => ({
    padding: ".5rem 2rem",
    ":hover": { backgroundColor: theme.palette.action.hover }
}));

export const StyledNavLink = styled(NavLink)({ transition: "all 0.3s" });
