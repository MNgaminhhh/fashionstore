import { Card } from "@mui/material";
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
export const TableRow = styled(Card)(({ theme }) => ({
  gap: 16,
  marginBlock: 16,
  display: "grid",
  borderRadius: 10,
  cursor: "pointer",
  alignItems: "center",
  padding: ".6rem 1.2rem",
  gridTemplateColumns: "1.5fr 2fr 1.5fr auto",
  [theme.breakpoints.down("sm")]: {
    gap: 8,
    gridTemplateColumns: "repeat(2, 1fr)",
  },
}));
