import styled from "@emotion/styled";
import { Menu, MenuItem } from "@mui/material";

export const StyledMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: "8px",
    boxShadow: theme.shadows[2],
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    position: "absolute",
  },
}));

export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: "8px 16px",
  fontWeight: 500,
  fontSize: "14px",
  "&:hover": {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.main,
  },
}));
