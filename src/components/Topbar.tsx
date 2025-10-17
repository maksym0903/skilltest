// src/components/Topbar.tsx
"use client";

import * as React from "react";
import {
  AppBar, Toolbar, IconButton, Stack, Button, Box
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NightlightIcon from "@mui/icons-material/Nightlight";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import Link from "next/link";
import { ThemeModeContext } from "@/app/providers";
import { useAuth } from "@/contexts/AuthContext";
import SignInButton from "./Buttons/SignInButton";

export default function Topbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { mode, toggle } = React.useContext(ThemeModeContext);
  const { user, isAuthenticated, signOut } = useAuth();
  // const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const nav = [
    { label: "Features", href: "/#features" },
    { label: "About",   href: "/#about" },
    { label: "Blog",    href: "/#blog" },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <AppBar 
      position="fixed" 
      color="default" 
      elevation={1}
      sx={{ 
        width: "100%",
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: 'background.paper',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        <IconButton edge="start" onClick={onToggleSidebar} aria-label="toggle sidebar">
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        {/* section nav - centered */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.5, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          {nav.map((item) => (
            <Button
              key={item.href}
              component={Link}
              href={item.href}
              // keep them as text buttons so they look like top-nav
              variant="text"
            >
              {item.label}
            </Button>
          ))}
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            variant="outlined"
            startIcon={mounted ? (mode === "dark" ? <WbSunnyIcon /> : <NightlightIcon />) : <NightlightIcon />}
            onClick={toggle}
          >
            {mounted ? (mode === "dark" ? "Light" : "Dark") : "Dark"}
          </Button>
          
          {isAuthenticated && user ? (
            <Button
              variant="outlined"
              onClick={signOut}
            >
              Sign Out
            </Button>
          ) : (
            <SignInButton />
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
