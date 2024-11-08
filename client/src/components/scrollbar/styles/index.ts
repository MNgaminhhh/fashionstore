"use client";
import { alpha, styled } from "@mui/material/styles";
import SimpleBar from "simplebar-react";

export const StyledScrollBar = styled(SimpleBar)(({ theme }) => ({
  maxHeight: "90vh",
  height: "100%",
  overflowY: "auto",
  "& .simplebar-scrollbar": {
    width: "8px",
    height: "8px",
    borderRadius: "8px",
    backgroundColor: alpha(theme.palette.grey[600], 0.3),
    transition: "background-color 0.3s ease, opacity 0.3s ease",
    "&.simplebar-visible:before": {
      opacity: 1,
      backgroundColor: alpha(theme.palette.grey[600], 0.8),
    },
    "&:hover": {
      backgroundColor: alpha(theme.palette.grey[600], 0.6),
    },
  },
  "& .simplebar-track.simplebar-vertical": {
    width: "8px",
  },
  "& .simplebar-track.simplebar-horizontal .simplebar-scrollbar": {
    height: "6px",
  },
  "& .simplebar-mask": {
    zIndex: "inherit",
  },
}));
