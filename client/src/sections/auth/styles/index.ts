import { Card, Box, Container } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledWrapper = styled(Card)(({ theme }) => ({
    width: 500,
    padding: "2rem 3rem",
    [theme.breakpoints.down("sm")]: {
        width: "100%",
    }
}));
export const StyledSection = styled(Box)(({ theme }) => ({
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative",
    padding: `${theme.spacing(10)} 0`,
    color: "#fff",
    "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1,
    },
}));

export const StyledContainer = styled(Container)({
    position: "relative",
    zIndex: 2,
});

export const StyledList = styled("ul")(({ theme }) => ({
    listStyle: "none",
    display: "flex",
    justifyContent: "left",
    gap: theme.spacing(2),
    marginTop: theme.spacing(2),
    padding: 0,
}));
