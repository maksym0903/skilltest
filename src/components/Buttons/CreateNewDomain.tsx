"use client";

import { Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import Link from "next/link";

interface CreateNewDomainProps {
  variant?: "contained" | "outlined" | "text";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean | { xs?: boolean; sm?: boolean; md?: boolean; lg?: boolean; xl?: boolean };
  disabled?: boolean;
  className?: string;
  sx?: import("@mui/system").SxProps<import("@mui/material").Theme>;
}

export default function CreateNewDomain({
  variant = "contained",
  size = "medium",
  fullWidth = false,
  disabled = false,
  className = "",
  sx = {},
}: CreateNewDomainProps) {
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
      const styles: Record<string, object> = {};
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
      component={Link}
      href="/domains/create"
      variant={variant}
      size={size}
      fullWidth={getFullWidthValue()}
      disabled={disabled}
      startIcon={<AddIcon />}
      className={className}
      sx={{
        fontWeight: 600,
        textTransform: 'none',
        borderRadius: 2,
        ...getFullWidthStyles(),
        ...sx,
      }}
    >
      Register Domain
    </Button>
  );
}
