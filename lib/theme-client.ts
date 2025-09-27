export type Theme = "light" | "dark" | "blue" | "green" | "system";

export const THEME_COOKIE_NAME = "theme";

export const THEME_COOKIE_OPTIONS = {
  expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};
