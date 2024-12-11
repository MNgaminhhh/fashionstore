import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

export const StyledButton = styled(Button, {
    shouldForwardProp: (prop) => prop !== "variantType"
})<{ variantType: "login" | "register" }>(({ theme, variantType }) => ({
    fontSize: '14px',
    padding: '6px 20px',
    borderRadius: '4px',
    color: variantType === "login" ?'black':'white',
    textTransform: 'none',
    backgroundColor: variantType === "login" ? 'white' : theme.palette.primary.light ,
    '&:hover': {
        backgroundColor: variantType === "login"
            ? theme.palette.info.dark
            : theme.palette.success.dark,
        color: theme.palette.common.white,
    },
}));
