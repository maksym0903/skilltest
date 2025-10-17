// src/app/page.tsx
"use client";

import * as React from "react";
import {
  Box
} from "@mui/material";

// import your existing components
import Hero from "@/components/pages/Hero";
import About from "@/components/pages/About";
import Features from "@/components/pages/Features";
import Blog from "@/components/pages/Blog";
import Contact from "@/components/pages/Contact";

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <Box id={id} component="section" sx={{ scrollMarginTop: 80, py: { xs: 6, md: 10 } }}>
      {children}
    </Box>
  );
}

export default function LandingPage() {
  return (
    <Box
      sx={{
        background: (t) =>
          t.palette.mode === "light"
            ? "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 60%)"
            : "linear-gradient(180deg, #0b0b0c 0%, #111214 60%)",
      }}
    >
      {/* HERO */}
      <Hero />

      {/* Reused components as sections */}
      <Section id="features"><Features /></Section>
      <Section id="about"><About /></Section>
      <Section id="blog"><Blog /></Section>
      <Section id="contact"><Contact /></Section>
    </Box>
  );
}
