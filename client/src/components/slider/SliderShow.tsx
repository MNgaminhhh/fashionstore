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

const SliderShow = forwardRef<Slider, Props>((props, ref) => {
  const {
    dotColor,
    children,
    arrowStyles,
    dots = false,
    arrows = true,
    slidesToShow = 3,
    spaceBetween = 8,
    dotStyles = { mt: 2 },
    infinite = true,
    ...others
  } = props;

  const theme = useTheme();

  const settings: Settings = {
    dots,
    arrows,
    slidesToShow,
    infinite,
    ...Arrows(arrowStyles),
    ...Dots({ dotColor, sx: dotStyles }),
    ...others,
  };

  return (
    <RootStyle space={spaceBetween}>
      <SlickCarousel ref={ref} {...settings}>
        {children}
      </SlickCarousel>
    </RootStyle>
  );
});
SliderShow.displayName = "SliderShow";
export default SliderShow;
