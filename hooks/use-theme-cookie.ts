"use client";

import { useTheme as useNextTheme } from "next-themes";
import { useEffect } from "react";
import Cookies from "js-cookie";
import {
  THEME_COOKIE_NAME,
  THEME_COOKIE_OPTIONS,
  type Theme,
} from "../lib/theme-client";

export function useTheme() {
  const { theme, setTheme: setNextTheme, ...rest } = useNextTheme();

  const setTheme = (newTheme: Theme) => {
    // Set the theme in next-themes
    setNextTheme(newTheme);

    // Also set it in cookies for SSR
    Cookies.set(THEME_COOKIE_NAME, newTheme, {
      expires: THEME_COOKIE_OPTIONS.expires,
      secure: THEME_COOKIE_OPTIONS.secure,
      sameSite: THEME_COOKIE_OPTIONS.sameSite,
      path: THEME_COOKIE_OPTIONS.path,
    });
  };

  // Sync next-themes with cookies on theme change
  useEffect(() => {
    if (theme) {
      Cookies.set(THEME_COOKIE_NAME, theme, {
        expires: THEME_COOKIE_OPTIONS.expires,
        secure: THEME_COOKIE_OPTIONS.secure,
        sameSite: THEME_COOKIE_OPTIONS.sameSite,
        path: THEME_COOKIE_OPTIONS.path,
      });
    }
  }, [theme]);

  return {
    theme: theme as Theme,
    setTheme,
    ...rest,
  };
}
