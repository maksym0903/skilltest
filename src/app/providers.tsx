"use client";

import * as React from "react";
// NOTE: use the v14-appRouter helper even on Next 15 (expected)
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "@/theme";
import { AuthProvider } from "@/contexts/AuthContext";
import { SnackbarProvider } from "notistack";

export const ThemeModeContext = React.createContext({
  mode: "light" as "light" | "dark",
  toggle: () => {}
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<"light" | "dark">("light");
  const [mounted, setMounted] = React.useState(false);

  // Initialize theme from localStorage after hydration
  React.useEffect(() => {
    const savedMode = localStorage.getItem("theme-mode") as "light" | "dark";
    if (savedMode) {
      setMode(savedMode);
    }
    setMounted(true);
  }, []);

  const toggle = React.useCallback(() => {
    setMode((m) => {
      const next = m === "light" ? "dark" : "light";
      if (typeof window !== "undefined") localStorage.setItem("theme-mode", next);
      return next;
    });
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <AppRouterCacheProvider>
      <AuthProvider>
        <ThemeModeContext.Provider value={{ mode, toggle }}>
          <ThemeProvider theme={getTheme(mode)}>
            <CssBaseline />
            <SnackbarProvider maxSnack={3}>
              {children}
            </SnackbarProvider>
          </ThemeProvider>
        </ThemeModeContext.Provider>
      </AuthProvider>
    </AppRouterCacheProvider>
  );
}
