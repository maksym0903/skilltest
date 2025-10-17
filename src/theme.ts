// src/theme.ts
import { createTheme, alpha } from "@mui/material/styles";

export const getTheme = (mode: "light" | "dark") =>
  createTheme({
    cssVariables: true, // keep styles stable across SSR/CSR
    palette: {
      mode,
      primary: { main: mode === "light" ? "#2563eb" : "#60a5fa" },
      secondary: { main: "#7c3aed" },
      success: { main: "#16a34a" },
      warning: { main: "#d97706" },
      error:   { main: "#dc2626" },
      background: {
        default: mode === "light" ? "#f8fafc" : "#0b0b0c",
        paper:   mode === "light" ? "#f1f5f9" : "#111214"
      },
      divider: mode === "light" ? "#e2e8f0" : "#2a2a2a",
      text: {
        primary:   mode === "light" ? "#1e293b" : "#e8eaed",
        secondary: mode === "light" ? "#64748b" : "#a1a1aa"
      }
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily:
        `Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"`,
      h1: { fontWeight: 700, letterSpacing: -0.5 },
      h2: { fontWeight: 700, letterSpacing: -0.5 },
      h3: { fontWeight: 600 },
      button: { textTransform: "none", fontWeight: 600 }
    },
    shadows: [
      "none",
      "0 1px 2px rgba(0,0,0,.06)",
      "0 2px 6px rgba(0,0,0,.08)",
      "0 4px 8px rgba(0,0,0,.10)",
      "0 6px 12px rgba(0,0,0,.12)",
      "0 8px 16px rgba(0,0,0,.14)",
      "0 10px 20px rgba(0,0,0,.16)",
      "0 12px 24px rgba(0,0,0,.18)",
      "0 14px 28px rgba(0,0,0,.20)",
      "0 16px 32px rgba(0,0,0,.22)",
      "0 18px 36px rgba(0,0,0,.24)",
      "0 20px 40px rgba(0,0,0,.26)",
      "0 22px 44px rgba(0,0,0,.28)",
      "0 24px 48px rgba(0,0,0,.30)",
      "0 26px 52px rgba(0,0,0,.32)",
      "0 28px 56px rgba(0,0,0,.34)",
      "0 30px 60px rgba(0,0,0,.36)",
      "0 32px 64px rgba(0,0,0,.38)",
      "0 34px 68px rgba(0,0,0,.40)",
      "0 36px 72px rgba(0,0,0,.42)",
      "0 38px 76px rgba(0,0,0,.44)",
      "0 40px 80px rgba(0,0,0,.46)",
      "0 42px 84px rgba(0,0,0,.48)",
      "0 44px 88px rgba(0,0,0,.50)",
      "0 46px 92px rgba(0,0,0,.52)"
    ],
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true, variant: "contained" },
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 10,
            paddingInline: 16,
            "&:focus-visible": {
              outline: `2px solid ${theme.palette.primary.main}`,
              outlineOffset: 2
            }
          })
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: () => ({
            // Removed border for cleaner look
          })
        }
      },
      MuiTextField: {
        defaultProps: { size: "small" },
        styleOverrides: {
          root: ({ theme }) => ({
            "& .MuiOutlinedInput-root": {
              borderRadius: 10,
              background:
                theme.palette.mode === "light"
                  ? "#ffffff"
                  : alpha("#fff", 0.02)
            }
          })
        }
      },
      MuiAppBar: { defaultProps: { elevation: 0 } },
      MuiDrawer: {
        styleOverrides: {
          paper: () => ({ 
            // Removed border for cleaner look
          })
        }
      }
    }
  });
