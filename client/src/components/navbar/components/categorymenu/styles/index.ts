import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import styled from "@mui/material/styles/styled";
import {MTCard} from "../../../../MTCard";

const TRANSITION_DURATION = "150ms";
const CARD_HEIGHT = "100%";
const CATEGORY_LIST_WIDTH = 300;

const StyledWrapper = styled("div")(({ theme }) => ({
    cursor: "pointer",
    fontSize: '14px',
    transition: `color ${TRANSITION_DURATION} ease-in-out`,
    ":hover": {
        color: theme.palette.primary.main,
        "& .menu-list": { display: "block" }
    }
}));

const StyledContainer = styled("div")({
    left: 0,
    zIndex: 1600,
    fontSize: '14px',
    top: "68%",
    width: "100%",
    height: "100%",
    display: "none",
    minHeight: "500px",
    maxHeight: "500px",
    position: "absolute"
});

const StyledCard = styled(MTCard)({
    marginTop: 12,
    height: CARD_HEIGHT,
    display: "flex",
    borderRadius: 0
});

const StyledCategoryList = styled(List)(({ theme }) => ({
    padding: 0,
    width: CATEGORY_LIST_WIDTH,
    height: "100%",
    borderRight: `1px solid ${theme.palette.grey[200]}`
}));

const StyledCategory = styled(ListItem, {
    shouldForwardProp: (prop) => prop !== "active"
})<{ active: number }>(({ theme, active }) => ({
    padding: "1rem 1.5rem",
    transition: "all 0.3s",
    justifyContent: "space-between",
    ...(active && {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.primary[100]
    })
}));

const StyledSubCategoryList = styled(List)(({ theme }) => ({
    padding: 0,
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    [theme.breakpoints.down("xl")]: { gridTemplateColumns: "repeat(5, 1fr)" },
    [theme.breakpoints.down("lg")]: { gridTemplateColumns: "repeat(4, 1fr)" }
}));

const StyledSubCategory = styled(ListItem)(({ theme }) => ({
    gap: 12,
    fontSize: 13,
    padding: "0",
    alignItems: "center",
    marginBottom: "1.5rem",
    transition: "all 0.3s",
    ":hover": { color: theme.palette.primary.main }
}));

export {
    StyledWrapper,
    StyledCard,
    StyledCategoryList,
    StyledContainer,
    StyledSubCategoryList,
    StyledCategory,
    StyledSubCategory
};
