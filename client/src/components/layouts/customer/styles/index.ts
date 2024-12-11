import Card from "@mui/material/Card";
import styled from "@mui/material/styles/styled";
import { NavLink } from "../../../navlink";

export const StyledMainContainer = styled(Card)(({ theme }) => ({
  paddingBottom: "1.5rem",
  borderRadius: "12px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  transition: "box-shadow 0.3s ease",
  "&:hover": {
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
  },
  [theme.breakpoints.down("md")]: {
    boxShadow: "none",
    overflowY: "auto",
    height: "calc(100vh - 64px)",
  },
}));

export const StyledNavLink = styled(NavLink, {
  shouldForwardProp: (prop) => prop !== "isCurrentPath",
})<{ isCurrentPath: boolean }>(({ theme, isCurrentPath }) => ({
  display: "flex",
  alignItems: "center",
  borderLeft: "4px solid",
  paddingLeft: "1.5rem",
  paddingRight: "1.5rem",
  marginBottom: "0.75rem",
  justifyContent: "space-between",
  borderColor: isCurrentPath ? theme.palette.primary.main : "transparent",
  transition: "border-color 0.3s ease, background-color 0.3s ease",
  backgroundColor: isCurrentPath ? theme.palette.action.hover : "transparent",
  "& .nav-icon": {
    color: isCurrentPath ? theme.palette.primary.main : theme.palette.grey[600],
    transition: "color 0.3s ease",
  },
  "&:hover": {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
    "& .nav-icon": { color: theme.palette.primary.main },
  },
}));
