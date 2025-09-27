"use client";

import { useEffect } from "react";

interface ThemeScriptProps {
  theme: "light" | "dark" | "blue" | "green" | "system";
}

export default function ThemeScript({ theme }: ThemeScriptProps) {
  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const updateTheme = () => {
        const systemTheme = mediaQuery.matches ? "dark" : "light";
        document.documentElement.classList.remove(
          "light",
          "dark",
          "blue",
          "green"
        );
        document.documentElement.classList.add(systemTheme);
      };

      // Set initial theme
      updateTheme();

      // Listen for changes
      mediaQuery.addEventListener("change", updateTheme);

      return () => {
        mediaQuery.removeEventListener("change", updateTheme);
      };
    }
  }, [theme]);

  return null;
}
