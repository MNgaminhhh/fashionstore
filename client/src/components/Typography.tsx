"use client";
import clsx from "clsx";
import Box, { BoxProps } from "@mui/material/Box";
import styled from "@mui/material/styles/styled";

interface Props extends BoxProps {
    ellipsis?: boolean;
}

const StyledBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== "ellipsis",
})<{ellipsis: number}>(({ ellipsis }) => ({
    ...(ellipsis && {
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
    }),
}));

function customStyledTypography(component: keyof JSX.IntrinsicElements, fontSize: number, fontWeight: number) {
    return function Component(props: Props) {
        const { ellipsis, children, className, ...others } = props;

        return (
            <StyledBox
                ellipsis={ellipsis ? 1 : 0}
                fontSize={fontSize}
                component={component}
                fontWeight={fontWeight}
                {...(className && { className: clsx({ [className]: true }) })}
                {...others}
            >
                {children}
            </StyledBox>
        );
    };
}

export const H1 = customStyledTypography("h1", 30, 700);
export const H2 = customStyledTypography("h2", 25, 700);
export const H3 = customStyledTypography("h3", 20, 700);
export const H4 = customStyledTypography("h4", 17, 600);
export const H5 = customStyledTypography("h5", 16, 600);
export const H6 = customStyledTypography("h6", 14, 600);
export const Paragraph = customStyledTypography("p", 14, 400);
export const Small = customStyledTypography("small", 12, 400);
export const Span = customStyledTypography("span", 14, 400);
export const Tiny = customStyledTypography("small", 10, 400);
