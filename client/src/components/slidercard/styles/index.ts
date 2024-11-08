"use client";

import styled from "@mui/material/styles/styled";

export const StyledRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  borderRadius: "12px",
  overflow: "hidden",
  ".title": {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(2),
  },
  ".description": {
    fontSize: "1.1rem",
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(3),
  },
  ".button-link": {
    textDecoration: "none",
    display: "inline-block",
  },
}));
