'use client';

import { signInWithRedirect, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import '@/utils/amplify-client';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Typography,
  Alert,
} from '@mui/material';
import { Login as LoginIcon, Security as SecurityIcon } from '@mui/icons-material';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const next = searchParams.get('next') || '/dashboard';
      router.replace(next);
    }
  }, [isAuthenticated, authLoading, router, searchParams]);

  useEffect(() => {
    async function checkUser() {
      try {
        // First check if we have a valid session
        const session = await fetchAuthSession({ forceRefresh: false });
        if (session.tokens) {
          // We have tokens, get user info
          await getCurrentUser();
          const next = searchParams.get('next') || '/dashboard';
          router.replace(next);
          return;
        }
      } catch (error) {
        console.log('No existing session:', error);
      }

      // Check if this is a callback from OAuth
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      
      if (code && state) {
        // This is an OAuth callback, wait for session to be established
        try {
          // Wait a bit for the session to be processed
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const session = await fetchAuthSession({ forceRefresh: true });
          if (session.tokens) {
            await getCurrentUser();
            const next = searchParams.get('next') || '/dashboard';
            router.replace(next);
            return;
          }
        } catch (error) {
          console.error('OAuth callback error:', error);
          setError('Authentication failed. Please try again.');
        }
      }
    }

    if (!authLoading && !isAuthenticated) {
      checkUser();
    }
  }, [router, searchParams, authLoading, isAuthenticated]);

  const handleSignIn = async () => {
    setIsRedirecting(true);
    setError(null);
    try {
      await signInWithRedirect();
    } catch (error) {
      console.error('Sign in error:', error);
      setError('Failed to redirect to sign in. Please try again.');
      setIsRedirecting(false);
    }
  };

  if (authLoading || isRedirecting) {
    return (
      <Container maxWidth="sm">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          gap={3}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            {isRedirecting ? 'Redirecting to sign in...' : 'Checking authentication...'}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={3}
      >
        <Card elevation={3} sx={{ width: '100%', maxWidth: 400 }}>
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
              <Box display="flex" alignItems="center" gap={2}>
                <SecurityIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h4" component="h1" fontWeight="bold">
                  Mother App
                </Typography>
              </Box>
              
              <Typography variant="h6" color="text.secondary" textAlign="center">
                Multi-tenant Application Management System
              </Typography>

              {error && (
                <Alert severity="error" sx={{ width: '100%' }}>
                  {error}
                </Alert>
              )}

              <Button
                variant="contained"
                size="large"
                startIcon={<LoginIcon />}
                onClick={handleSignIn}
                disabled={isRedirecting}
                sx={{ 
                  width: '100%',
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                {isRedirecting ? 'Redirecting...' : 'Sign in with Cognito'}
              </Button>

              <Typography variant="body2" color="text.secondary" textAlign="center">
                Secure authentication powered by AWS Cognito
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <Container maxWidth="sm">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          gap={3}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Loading...
          </Typography>
        </Box>
      </Container>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
