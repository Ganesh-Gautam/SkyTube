import { useEffect, useMemo, useState } from "react";
import { applyTheme, readInitialTheme, ThemeContext } from "./theme.js";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => readInitialTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const value = useMemo(() => {
    return {
      theme,
      setTheme,
      toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    };
  }, [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

