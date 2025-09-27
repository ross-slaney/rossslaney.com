"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Theme } from "../../lib/theme";

export async function setTheme(theme: Theme) {
  const cookieStore = await cookies();

  cookieStore.set("theme", theme, {
    expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  // Redirect to refresh the page with new theme
  redirect("/");
}
