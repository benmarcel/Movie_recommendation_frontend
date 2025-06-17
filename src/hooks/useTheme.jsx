import { ThemeContext } from "../contexts/themeContext";
import { useContext } from "react";
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
export default useTheme;
// This custom hook provides access to the theme context.