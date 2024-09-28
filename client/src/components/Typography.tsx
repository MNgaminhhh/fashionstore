import { Box, styled } from "@mui/material";
import clsx from "clsx";
import {ReactNode, CSSProperties, FC} from "react";

interface TextProps {
    children: ReactNode;
    className?: string;
    ellipsis?: boolean;
    textTransform?: CSSProperties["textTransform"];
    [key: string]: any;
}

const StyledBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== "textTransformStyle" && prop !== "ellipsis",
})<{ textTransformStyle?: string; ellipsis?: boolean }>(({ textTransformStyle, ellipsis }) => ({
    textTransform: textTransformStyle || "none",
    whiteSpace: ellipsis ? "nowrap" : "normal",
    overflow: ellipsis ? "hidden" : "",
    textOverflow: ellipsis ? "ellipsis" : "",
}));


export const H6: React.FC<TextProps> = ({ children, className, ellipsis, textTransform, ...props }) => {
    return (
        <StyledBox
            textTransformStyle={textTransform}
            ellipsis={ellipsis}
            className={clsx(className)}
            component="h6"
            mb={0}
            mt={0}
            fontSize="14px"
            fontWeight="600"
            lineHeight="1.5"
            {...props}
        >
            {children}
        </StyledBox>
    );
};
