"use client";

import { PropsWithChildren, forwardRef } from "react";
import { SxProps, Theme, useTheme } from "@mui/material/styles";
import SlickCarousel, { Settings } from "react-slick";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { RootStyle } from "./styles";
import Arrows from "./components/arrows";
import Dots from "./components/dots";
interface Props extends PropsWithChildren, Settings {
    dotColor?: string;
    spaceBetween?: number;
    dotStyles?: SxProps<Theme>;
    arrowStyles?: SxProps<Theme>;
}

const Carousel = forwardRef<Slider, Props>((props, ref) => {
    const {
        dotColor,
        children,
        arrowStyles,
        dots = false,
        arrows = true,
        slidesToShow = 4,
        spaceBetween = 10,
        dotStyles = { mt: 4 },
        ...others
    } = props;

    const theme = useTheme();

    const settings: Settings = {
        dots,
        arrows,
        slidesToShow,
        ...Arrows(arrowStyles),
        ...Dots({ dotColor, sx: dotStyles }),
        ...others
    };

    return (
        <RootStyle space={spaceBetween}>
            <SlickCarousel ref={ref} {...settings}>
                {children}
            </SlickCarousel>
        </RootStyle>
    );
});

export default Carousel;
