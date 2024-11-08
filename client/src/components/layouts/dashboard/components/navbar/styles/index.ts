import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import styled from "@mui/material/styles/styled";
import InputBase from "@mui/material/InputBase";
import { FlexCenterRow } from "../../../../../flexbox";

export const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  zIndex: 200,
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  backgroundColor: theme.palette.common.black,
  boxShadow: theme.shadows[1],
  color: theme.palette.text.primary,
  marginBottom: "20px",
}));

export const StyledToolBar = styled(Toolbar)({
  "@media (min-width: 0px)": {
    paddingLeft: 0,
    paddingRight: 0,
    minHeight: "auto",
  },
});

export const ToggleWrapper = styled(FlexCenterRow)(({ theme }) => ({
  width: "2.5rem",
  height: "2.5rem",
  flexShrink: 0,
  display: "none",
  cursor: "pointer",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[100],
  [theme.breakpoints.down("lg")]: {
    display: "flex",
  },
}));

export const CustomButton = styled(Button)(({ theme }) => ({
  minHeight: "2.5rem",
  flexShrink: 0,
  marginLeft: theme.spacing(2),
  padding: theme.spacing(0, 2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.grey[800],
  },
  [theme.breakpoints.down("xs")]: {
    display: "none",
  },
}));
