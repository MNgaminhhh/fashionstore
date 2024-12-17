import { blue, themeColors } from "./ThemeColors";
import { breakpoints } from "./ThemeSetting";
import { typography } from "./typography";
import { components } from "./components";

export const themesOptions = {
  typography,
  components,
  breakpoints,
  palette: { primary: { ...blue }, ...themeColors },
};
