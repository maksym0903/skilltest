"use client";

import * as React from "react";
import { Button } from "@mui/material";
import { CloudDownload as DownloadIcon } from "@mui/icons-material";

interface AdoptApplicationButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "text" | "outlined" | "contained";
  fullWidth?: boolean;
}

export default function AdoptApplicationButton({
  onClick,
  disabled = false,
  loading = false,
  variant = "contained",
  fullWidth = false,
}: AdoptApplicationButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      disabled={disabled || loading}
      startIcon={<DownloadIcon />}
      fullWidth={fullWidth}
    >
      Adopt Application
    </Button>
  );
}

