"use client";

import Box from "@mui/material/Box";
import styled from "@mui/material/styles/styled";

export const COMMON_DOT_STYLES = {
  left: 0,
  right: 0,
  bottom: 25,
  position: "absolute",
};

export const RootStyle = styled("div", {
  shouldForwardProp: (prop) => prop !== "space",
})<{ space: number }>(({ space }) => ({
  ".slick-list": { marginInline: -space },
  ".slick-slide": { paddingInline: space },
  ":hover": {
    ".slick-arrow": {
      opacity: 1,
      "&.next": { right: 5 },
      "&.prev": { left: 5 },
    },
  },
}));

export const DotList = styled(Box)(({ theme }) => ({
  gap: 1,
  zIndex: 1,
  margin: 0,
  padding: "20px 0 !important",
  marginTop: "20px !important",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  listStyle: "none",
  "& li": {
    width: 15,
    height: 15,
    display: "flex",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "center",
    "&.slick-active span": {
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

export const Dot = styled("span", {
  shouldForwardProp: (prop) => prop !== "dotColor",
})<{ dotColor?: string }>(({ dotColor, theme }) => ({
  width: 12,
  height: 12,
  cursor: "pointer",
  borderRadius: "50%",
  display: "block",
  backgroundColor: dotColor || theme.palette.grey[400],
  transition: "background-color 0.3s ease, transform 0.3s ease",
  "&:hover": {
    backgroundColor: dotColor || theme.palette.primary.main,
    transform: "scale(1.1)",
  },
  "&:after": {
    content: '""',
    display: "block",
    borderRadius: "50%",
    position: "absolute",
  },
}));

export const ArrowButton = styled(Box)(({ theme }) => ({
  zIndex: 1,
  width: 35,
  height: 35,
  padding: 0,
  opacity: 0.8,
  top: "50%",
  display: "flex",
  cursor: "pointer",
  position: "absolute",
  alignItems: "center",
  justifyContent: "center",
  transform: "translate(0, -50%)",
  transition: "opacity 0.3s ease-in-out",
  backgroundColor: theme.palette.primary.main,
  borderRadius: "50%",
  color: theme.palette.common.white,
  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",

  "&.slick-disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  },

  ":hover": {
    opacity: 1,
  },
}));
