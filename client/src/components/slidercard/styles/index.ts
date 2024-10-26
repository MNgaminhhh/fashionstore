"use client";

import styled from "@mui/material/styles/styled";

export const StyledRoot = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    ".title": {
        fontSize: 50,
        marginTop: 0,
        lineHeight: 1.2,
        marginBottom: "1.35rem",
    },
}));
