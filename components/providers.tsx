"use client";

import { ThemeProvider } from "next-themes";
import { THEME_COOKIE_NAME } from "../lib/theme-client";

interface ProvidersProps {
  children: React.ReactNode;
  theme?: string;
}

export function Providers({ children, theme }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={theme || "system"}
      themes={["light", "dark", "blue", "green"]}
      enableSystem={true}
      disableTransitionOnChange={false}
      storageKey={THEME_COOKIE_NAME}
      enableColorScheme={false}
    >
      {children}
    </ThemeProvider>
  );
}
