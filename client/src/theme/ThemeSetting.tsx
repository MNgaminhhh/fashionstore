import { blue, green, orange, red, grey } from "@mui/material/colors";

export const themeColors = {
  info: blue,
  success: green,
  error: red,
  warning: orange,
  text: { primary: grey[900], secondary: grey[800], disabled: grey[400] },
  divider: grey[200],
  grey: { ...grey },
  background: { default: grey[100] },
};
export const primary = {
  100: "#FCE9EC",
  200: "#F8C7CF",
  300: "#F07D90",
  400: "#EC6178",
  500: "#D23F57",
  600: "#E63E58",
  700: "#E3364E",
  800: "#DF2E44",
  900: "#D91F33",
};

export const secondary = {
  100: "#e8e8ee",
  200: "#b9bacb",
  300: "#8a8ca8",
  400: "#5b5d85",
  500: "#141850",
  600: "#0F3460",
  700: "#101340",
  800: "#0e1138",
  900: "#0c0e30",
  main: "#0F3460",
  dark: "#0c0e30",
};

export const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1600,
    xxl: 1920,
  },
};
