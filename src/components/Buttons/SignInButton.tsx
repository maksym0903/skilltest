"use client";

import { signInWithRedirect } from 'aws-amplify/auth';
import { Button } from "@mui/material";
import { Login as LoginIcon } from "@mui/icons-material";
import { useState } from "react";
import '@/utils/amplify-client';

export default function SignInButton() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleSignIn = async () => {
    setIsRedirecting(true);
    try {
      await signInWithRedirect();
    } catch (error) {
      console.error('Sign in error:', error);
      setIsRedirecting(false);
    }
  };

  return (
    <Button
      variant="contained"
      startIcon={<LoginIcon />}
      onClick={handleSignIn}
      disabled={isRedirecting}
      sx={{
        borderRadius: 2,
        textTransform: "none",
        fontWeight: 600,
        px: 2,
      }}
    >
      {isRedirecting ? 'Redirecting...' : 'Sign In'}
    </Button>
  );
}
