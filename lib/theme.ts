import { cookies } from "next/headers";

export type Theme = "light" | "dark" | "blue" | "green" | "system";

export async function getTheme(): Promise<Theme> {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value as Theme;

  if (theme && ["light", "dark", "blue", "green", "system"].includes(theme)) {
    return theme;
  }

  return "system"; // Default theme
}

export function getResolvedTheme(
  theme: Theme
): "light" | "dark" | "blue" | "green" {
  if (theme === "system") {
    // For SSR, we'll default to light and let CSS handle system preference
    return "light";
  }
  return theme;
}
