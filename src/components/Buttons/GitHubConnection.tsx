"use client";

import * as React from "react";
import { Button, CircularProgress } from "@mui/material";
import { GitHub } from "@mui/icons-material";
import GitHubService, { GitHubStatusResponse } from "@/services/github";
import { useAuth } from "@/contexts/AuthContext";


interface GitHubConnectionProps {
  variant?: "contained" | "outlined" | "text";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean | { xs?: boolean; sm?: boolean; md?: boolean; lg?: boolean; xl?: boolean };
  disabled?: boolean;
  className?: string;
  sx?: import("@mui/system").SxProps<import("@mui/material").Theme>;
}

export default function GitHubConnection({
  variant = "contained",
  size = "medium",
  fullWidth = false,
  disabled = false,
  className = "",
  sx = {},
}: GitHubConnectionProps) {
  const { user } = useAuth();
  
  const [connectionStatus, setConnectionStatus] = React.useState<{
    connected: boolean;
    loading: boolean;
    error: string | null;
    username?: string;
  }>({
    connected: false,
    loading: true,
    error: null,
  });

  const fetchConnectionStatus = React.useCallback(async () => {
    try {
      setConnectionStatus(prev => ({ ...prev, loading: true, error: null }));
      const response: GitHubStatusResponse = await GitHubService.getConnectionStatus();
      
      if (response.success) {
        setConnectionStatus({
          connected: response.data.connected,
          loading: false,
          error: null,
          username: response.data.github_username,
        });
      } else {
        setConnectionStatus({
          connected: false,
          loading: false,
          error: response.message,
        });
      }
    } catch (error) {
      console.error('Failed to fetch GitHub connection status:', error);
      setConnectionStatus({
        connected: false,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to check connection status',
      });
    }
  }, []);

  React.useEffect(() => {
    fetchConnectionStatus();
  }, [fetchConnectionStatus]);

  const handleConnectionClick = async () => {
    if (connectionStatus.connected || connectionStatus.loading) return;

    try {
      // Get fresh status to get the login URL
      const response: GitHubStatusResponse = await GitHubService.getConnectionStatus();
      if (!response.success && response.data.login_url) {
        const userId = user?.userId || '';
        // const redirectUrl = `${response.data.login_url}&user_id=${encodeURIComponent(userId)}`;
        const redirectUrl = `https://98hrhf3u84.execute-api.us-east-1.amazonaws.com/dev/api/repos/auth/github/login?state=${encodeURIComponent(response.data.login_url)}&user_id=${encodeURIComponent(userId)}`;
        window.location.href = redirectUrl;
      } else {
        alert('Unable to get GitHub login URL. Please try again.');
      }
    } catch (error) {
      console.error('Failed to initiate GitHub connection:', error);
      alert('Failed to connect to GitHub. Please try again.');
    }
  };
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
      const styles: Record<string, React.CSSProperties> = {};
      if (fullWidth.xs) styles['@media (max-width:600px)'] = { width: '100%' };
      if (fullWidth.sm) styles['@media (min-width:600px)'] = { width: '100%' };
      if (fullWidth.md) styles['@media (min-width:900px)'] = { width: '100%' };
      if (fullWidth.lg) styles['@media (min-width:1200px)'] = { width: '100%' };
      if (fullWidth.xl) styles['@media (min-width:1536px)'] = { width: '100%' };
      return styles;
    }
    return {};
  };

  // Determine button state and styling
  const isConnected = connectionStatus.connected;
  const isLoading = connectionStatus.loading;
  const isDisabled = disabled || isLoading || isConnected;

  // Get button text based on status
  const getButtonText = () => {
    if (isLoading) return 'Checking...';
    if (isConnected) return `Connected${connectionStatus.username ? ` (${connectionStatus.username})` : ''}`;
    return 'Connect GitHub';
  };

  // Get button color based on status
  const getButtonStyles = () => {
    if (isConnected) {
      return {
        backgroundColor: '#28a745', // Green for connected
        color: 'white',
        '&:hover': {
          backgroundColor: '#28a745', // Keep green on hover
        },
        '&:disabled': {
          backgroundColor: '#28a745',
          color: 'white',
        },
      };
    } else {
      return {
        backgroundColor: '#dc3545', // Red for not connected
        color: 'white',
        '&:hover': {
          backgroundColor: '#c82333',
        },
        '&:disabled': {
          backgroundColor: '#6c757d',
          color: 'white',
        },
      };
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      fullWidth={getFullWidthValue()}
      disabled={isDisabled}
      onClick={handleConnectionClick}
      startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <GitHub />}
      className={className}
      sx={{
        ...getButtonStyles(),
        ...getFullWidthStyles(),
        ...sx,
      }}
    >
      {getButtonText()}
    </Button>
  );
}