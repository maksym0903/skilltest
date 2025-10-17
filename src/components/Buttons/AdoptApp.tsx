"use client";

import { Button, SxProps, Theme } from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";

interface AdoptAppProps {
  variant?: "contained" | "outlined" | "text";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean | { xs?: boolean; sm?: boolean; md?: boolean; lg?: boolean; xl?: boolean };
  disabled?: boolean;
  className?: string;
  sx?: SxProps<Theme>;
  onClick?: () => void;
}

export default function AdoptApp({
  variant = "outlined",
  size = "medium",
  fullWidth = false,
  disabled = false,
  className = "",
  sx = {},
  onClick,
}: AdoptAppProps) {
  // Handle responsive fullWidth
  const getFullWidthValue = () => {
    if (typeof fullWidth === 'boolean') {
      return fullWidth;
    }
    return false; // Default to false for responsive objects
  };

  // Handle responsive fullWidth styles
  const getFullWidthStyles = () => {
    if (typeof fullWidth === 'object') {
      const styles: Record<string, { width: string }> = {};
      if (fullWidth.xs) styles['@media (max-width:600px)'] = { width: '100%' };
      if (fullWidth.sm) styles['@media (min-width:600px)'] = { width: '100%' };
      if (fullWidth.md) styles['@media (min-width:900px)'] = { width: '100%' };
      if (fullWidth.lg) styles['@media (min-width:1200px)'] = { width: '100%' };
      if (fullWidth.xl) styles['@media (min-width:1536px)'] = { width: '100%' };
      return styles;
    }
    return {};
  };

  return (
    <Button
      variant={variant}
      size={size}
      fullWidth={getFullWidthValue()}
      disabled={disabled}
      startIcon={<DownloadIcon />}
      className={className}
      onClick={onClick}
      sx={{
        fontWeight: 600,
        textTransform: 'none',
        borderRadius: 2,
        ...getFullWidthStyles(),
        ...sx,
      }}
    >
      Adopt App
    </Button>
  );
}
