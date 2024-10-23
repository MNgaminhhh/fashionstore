import { styled } from "@mui/material/styles";

export const StyledBox = styled("div")(({ theme }) => ({
    display: "flex",
    marginTop: theme.spacing(-2),
    marginBottom: theme.spacing(3),
    "& .headerHold": {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "space-between",
    },
    [theme.breakpoints.up("md")]: {
        "& .sidenav": { display: "none" },
    },
    [theme.breakpoints.down("md")]: {
        flexDirection: "column",
    },
}));
