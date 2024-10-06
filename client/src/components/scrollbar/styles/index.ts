"use client";
import { alpha, styled } from "@mui/material/styles";
import SimpleBar from "simplebar-react";

export const StyledScrollBar = styled(SimpleBar)(({ theme }) => ({
    maxHeight: "100%",
    "& .sbar-scrollbar": {
        "&.sbar-visible:before": { opacity: 1 },
        "&:before": {
            backgroundColor: alpha(theme.palette.grey[400], 0.6),
            transition: "opacity 0.2s ease"
        },
    },
    "& .sbar-track.sbar-vertical": { width: 9 },
    "& .sbar-track.sbar-horizontal .sbar-scrollbar": { height: 6 },
    "& .sbar-mask": { zIndex: "inherit" }
}));
