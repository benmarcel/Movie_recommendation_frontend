
import { useEffect, useState } from "react";
import { ThemeContext } from "./themeContext.js";
export const ThemeProvider = ({ children }) => {
  // Initialize theme state. We'll set the actual default based on localStorage or system preference.
  const [theme, setTheme] = useState("dark"); // Default to 'dark' initially, will be overridden by localStorage

  // --- Effect to load saved theme and apply it on initial render ---
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      // If no saved theme, check user's system preference
      setTheme("dark");
    } else {
      // Default to light if no saved theme and system preference is light
      setTheme("light");
    }
  }, []); // Run only once on component mount

  // --- Effect to apply theme class to <html> and save to localStorage ---
  useEffect(() => {
    const root = document.documentElement; // Get the HTML element

    // Remove any existing theme classes first to ensure a clean state
    root.classList.remove('light', 'dark');

    // Add 'dark' class if the current theme state is 'dark'
    if (theme === 'dark') {
      root.classList.add('dark');
    }
    // For 'light' theme, we simply ensure the 'dark' class is *not* present.
    // Tailwind's dark mode works by the *presence* of the 'dark' class.

    // Save the current theme preference to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]); // Re-run this effect whenever the 'theme' state changes

  // Toggle function
  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
;