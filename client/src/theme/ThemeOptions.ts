import { primary, secondary, themeColors, breakpoints } from "./ThemeSetting";

export const themesOptions = {
  palette: {
    primary: { ...primary, main: primary[500] },
    secondary: { ...secondary, main: secondary.main },
    background: {
      default: themeColors.background.default,
      paper: "#FFFFFF",
    },
    text: {
      primary: themeColors.text.primary,
      secondary: themeColors.text.secondary,
      disabled: themeColors.text.disabled,
    },
    divider: themeColors.divider,
    info: themeColors.info,
    success: themeColors.success,
    error: themeColors.error,
    warning: themeColors.warning,
    grey: themeColors.grey,
  },
  breakpoints: breakpoints,
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif",
    h1: { fontWeight: 600, fontSize: 35, lineHeight: 1.5 },
    h2: { fontWeight: 600, fontSize: 29, lineHeight: 1.5 },
    h3: { fontWeight: 600, fontSize: 24, lineHeight: 1.4 },
    h4: { fontWeight: 600, fontSize: 20, lineHeight: 1.4 },
    h5: { fontWeight: 600, fontSize: 18, lineHeight: 1.3 },
    h6: { fontWeight: 600, fontSize: 16, lineHeight: 1.3 },
    body1: { fontSize: 14 },
    body2: { fontSize: 12 },
    subtitle1: { fontSize: 16, fontWeight: 500 },
    subtitle2: { fontSize: 14, fontWeight: 500 },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  shadows: [
    "none",
    "0px 1px 3px rgba(3, 0, 71, 0.09)",
    "0px 4px 16px rgba(43, 52, 69, 0.1)",
    "0px 8px 45px rgba(3, 0, 71, 0.09)",
    "0px 0px 28px rgba(3, 0, 71, 0.01)",
  ],
};
