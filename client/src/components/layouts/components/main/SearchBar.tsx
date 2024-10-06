import React from "react";
import { styled } from "@mui/material/styles";
import { Box, IconButton } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

const SearchContainer = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    borderRadius: "50px",
    backgroundColor: theme.palette.common.white,
    overflow: "hidden",
    width: "100%",
    maxWidth: "500px",
    [theme.breakpoints.down("sm")]: {
        display: "none",
    },
}));

const SearchInput = styled("input")(({ theme }) => ({
    border: "none",
    padding: theme.spacing(1, 2),
    outline: "none",
    flex: 1,
    color: "black",
    fontSize: theme.typography.body1.fontSize,
    "&::placeholder": {
        color: theme.palette.text.secondary,
    },
}));

const SearchButton = styled(IconButton)(({ theme }) => ({
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    borderRadius: "50%",
    margin: theme.spacing(0.5),
    "&:hover": {
        backgroundColor: theme.palette.primary.main,
    },
}));

export default function SearchBar() {
    return (
        <>
            <SearchContainer>
                <SearchInput type="text" placeholder="Search..." />
                <SearchButton>
                    <SearchIcon />
                </SearchButton>
            </SearchContainer>
        </>
    );
}
