"use client";

import * as React from "react";
import "./globals.css";
import Providers from "./providers";
import { usePathname } from "next/navigation";
import StandardHeader from "@/components/StandardHeader";      // new standard header
import Sidebar from "@/components/Sidebar";    // separate components
import AuthGuard from "@/components/AuthGuard";
import Footer from "@/components/Footer";
import { Box, Toolbar } from "@mui/material";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(true);

  const isLanding = pathname === "/";
  const isLogin = pathname === "/login";
  const isPublicRoute = isLanding || isLogin;

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Providers>
          {/* Always show StandardHeader - spans full width */}
          <StandardHeader onToggleSidebar={() => setOpen((o) => !o)} />

          {/* Shell container */}
          <Box sx={{ display: "flex", minHeight: "100dvh", flexDirection: "column" }}>
            {/* Main content area */}
            <Box sx={{ display: "flex", flexGrow: 1 }}>
              {/* Sidebar only on non-landing routes */}
              {!isLanding && <Sidebar open={open} />}

              <Box 
                component="main" 
                sx={{ 
                  flexGrow: 1,
                  // Adjust margin to account for sidebar when present
                  ml: !isLanding ? (open ? 0 : 0) : 0,
                  transition: (theme) => theme.transitions.create('margin', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                  }),
                }}
              >
                {/* Spacer for the fixed AppBar */}
                <Toolbar />
                <Box
                  sx={{
                    // landing = full bleed; inner pages = centered content
                    p: isLanding ? 0 : 2,
                    maxWidth: isLanding ? "100%" : 1400,
                    mx: isLanding ? 0 : "auto",
                  }}
                >
                  {isPublicRoute ? (
                    children
                  ) : (
                    <AuthGuard>
                      {children}
                    </AuthGuard>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Footer - only show on landing page */}
            {isLanding && <Footer />}
          </Box>
        </Providers>
      </body>
    </html>
  );
}
