import { cookies } from "next/headers";

export type Theme = "light" | "dark" | "blue" | "green" | "system";

export const THEME_COOKIE_NAME = "theme";

export async function getServerTheme(): Promise<Theme> {
  try {
    const cookieStore = await cookies();
    const theme = cookieStore.get(THEME_COOKIE_NAME)?.value as Theme;

    if (theme && ["light", "dark", "blue", "green", "system"].includes(theme)) {
      return theme;
    }
  } catch (error) {
    // Silently fail during build - this is expected
    // Only log in development
    if (process.env.NODE_ENV === "development") {
      console.warn("Failed to read theme from cookies:", error);
    }
  }

  return "system"; // Default theme
}

export function resolveTheme(
  theme: Theme
): "light" | "dark" | "blue" | "green" {
  if (theme === "system") {
    // For SSR, default to light - client will override if needed
    return "light";
  }
  return theme;
}
