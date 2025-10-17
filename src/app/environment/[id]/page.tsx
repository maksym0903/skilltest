"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Stack,
  Button,
  Chip,
  Divider,
  Alert,
  Paper,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Cloud as CloudIcon,
  Code as CodeIcon,
  Storage as StorageIcon,
  CalendarToday as CalendarIcon,
  Link as LinkIcon,
  Security as SecurityIcon,
  Domain as DomainIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Apps as AppsIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { environmentsService } from "@/services/environments";
import { Environment } from "@/services/types";
import AuthGuard from "@/components/AuthGuard";

function EnvironmentDetailContent() {
  const params = useParams();
  const router = useRouter();
  const envId = params.id as string;

  const [env, setEnv] = React.useState<Environment | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch environment details
  const fetchEnvironmentDetails = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await environmentsService.getEnvironmentById(envId);
      
      if (response.success && response.data) {
        setEnv(response.data);
      } else {
        setError(response.message || "Failed to load environment details");
      }
    } catch (err) {
      console.error("Error fetching environment details:", err);
      setError("Failed to load environment details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [envId]);

  React.useEffect(() => {
    if (envId) {
      fetchEnvironmentDetails();
    }
  }, [envId, fetchEnvironmentDetails]);

  const handleBack = () => {
    router.push("/environment");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <CheckCircleIcon color="success" />;
      case 'inactive':
        return <ErrorIcon color="error" />;
      case 'building':
        return <WarningIcon color="warning" />;
      default:
        return <WarningIcon color="action" />;
    }
  };

  const getStatusColor = (status: string): 'success' | 'error' | 'warning' | 'default' => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'building':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Stack spacing={3} alignItems="center" sx={{ py: 4 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading environment details...
        </Typography>
      </Stack>
    );
  }

  // Show error state
  if (error) {
    return (
      <Stack spacing={3}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            variant="outlined"
          >
            Back to Environments
          </Button>
          <Typography variant="h4" fontWeight={700}>
            Environment Details
          </Typography>
        </Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <Button onClick={fetchEnvironmentDetails} variant="contained">
            Retry
          </Button>
        </Box>
      </Stack>
    );
  }

  if (!env) {
    return (
      <Stack spacing={3}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            variant="outlined"
          >
            Back to Environments
          </Button>
          <Typography variant="h4" fontWeight={700}>
            Environment Details
          </Typography>
        </Box>
        <Alert severity="warning">
          Environment not found.
        </Alert>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          variant="outlined"
        >
          Back to Environments
        </Button>
        <Typography variant="h4" fontWeight={700}>
          Environment Details
        </Typography>
      </Box>

      {/* Environment Information */}
      <Card>
        <CardContent>
          <Stack spacing={3}>
            {/* Environment Name and Status */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
              <Typography variant="h5" fontWeight={600}>
                {env.name}
              </Typography>
              <Chip
                icon={getStatusIcon(env.status)}
                label={env.status}
                color={getStatusColor(env.status)}
                size="small"
              />
              {env.auto_redeploy && (
                <Chip
                  label="Auto Redeploy"
                  color="info"
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>

            {/* Environment URLs */}
            {(env.amplify_app_url || env.custom_domain) && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {env.amplify_app_url && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CloudIcon color="action" />
                    <Button
                      component="a"
                      href={env.amplify_app_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="text"
                      startIcon={<LinkIcon />}
                      sx={{ textTransform: "none", p: 0, justifyContent: "flex-start" }}
                    >
                      Amplify URL: {env.amplify_app_url}
                    </Button>
                  </Box>
                )}
                {env.custom_domain && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <DomainIcon color="action" />
                    <Button
                      component="a"
                      href={`https://${env.custom_domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="text"
                      startIcon={<LinkIcon />}
                      sx={{ textTransform: "none", p: 0, justifyContent: "flex-start" }}
                    >
                      Custom Domain: {env.custom_domain}
                    </Button>
                  </Box>
                )}
              </Box>
            )}

            <Divider />

            {/* Environment Details Grid */}
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Paper sx={{ p: 2 }}>
                  <Stack spacing={2}>
                    <Typography variant="h6" fontWeight={600} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CodeIcon color="primary" />
                      Environment Information
                    </Typography>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Environment ID
                      </Typography>
                      <Typography variant="body1" fontFamily="monospace">
                        {env.id}
                      </Typography>
                    </Box>

                    
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Branch
                      </Typography>
                      <Typography variant="body1" fontFamily="monospace">
                        {env.branch || "main"}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Subdomain
                      </Typography>
                      <Typography variant="body1">
                        {env.subdomain || "Not set"}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Current Version
                      </Typography>
                      <Typography variant="body1">
                        {env.current_version || "Not deployed"}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Paper sx={{ p: 2 }}>
                  <Stack spacing={2}>
                    <Typography variant="h6" fontWeight={600} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <StorageIcon color="primary" />
                      Deployment Status
                    </Typography>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Status
                      </Typography>
                      <Chip
                        icon={getStatusIcon(env.status)}
                        label={env.status}
                        color={getStatusColor(env.status)}
                        size="small"
                      />
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Auto Redeploy
                      </Typography>
                      <Chip
                        label={env.auto_redeploy ? "Enabled" : "Disabled"}
                        color={env.auto_redeploy ? "success" : "default"}
                        size="small"
                        variant="outlined"
                      />
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Last Deployment
                      </Typography>
                      <Typography variant="body1">
                        {env.last_deployment_id || "None"}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        AWS Account ID
                      </Typography>
                      <Typography variant="body1" fontFamily="monospace">
                        {env.aws_account_id || "Not set"}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Box>
            </Box>

            {/* Domain and SSL Information */}
            {(env.custom_domain || env.ssl_certificate_id) && (
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                  <SecurityIcon color="primary" />
                  Domain & SSL Configuration
                </Typography>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, flexWrap: "wrap" }}>
                  {env.custom_domain && (
                    <Box sx={{ flex: 1, minWidth: 200 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Custom Domain
                      </Typography>
                      <Typography variant="body1" fontFamily="monospace">
                        {env.custom_domain}
                      </Typography>
                    </Box>
                  )}
                  {env.domain_status && (
                    <Box sx={{ flex: 1, minWidth: 200 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Domain Status
                      </Typography>
                      <Chip
                        label={env.domain_status}
                        color={env.domain_status === "verified" ? "success" : "warning"}
                        size="small"
                      />
                    </Box>
                  )}
                  {env.ssl_certificate_id && (
                    <Box sx={{ flex: 1, minWidth: 200 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        SSL Certificate ID
                      </Typography>
                      <Typography variant="body1" fontFamily="monospace">
                        {env.ssl_certificate_id}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            )}

            {/* DNS Records */}
            {env.dns_records && env.dns_records.length > 0 && (
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                  <DomainIcon color="primary" />
                  DNS Records
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {env.dns_records.length} DNS record{env.dns_records.length !== 1 ? 's' : ''} configured
                </Typography>
              </Paper>
            )}

            {/* Linked Applications */}
            {env.apps && env.apps.length > 0 && (
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                  <AppsIcon color="primary" />
                  Linked Applications
                </Typography>
                <Stack spacing={1}>
                  {env.apps.map((app) => (
                    <Box 
                      key={app.id}
                      sx={{ 
                        display: "flex", 
                        alignItems: "center",
                        p: 1.5,
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 1,
                        "&:hover": {
                          backgroundColor: "action.hover"
                        }
                      }}
                    >
                      <Link 
                        href={`/apps/${app.id}`}
                        style={{ 
                          textDecoration: "none",
                          color: "inherit",
                          flex: 1
                        }}
                      >
                        <Typography 
                          variant="body1" 
                          fontWeight={500}
                          sx={{ 
                            color: "primary.main",
                            cursor: "pointer",
                            "&:hover": {
                              textDecoration: "underline"
                            }
                          }}
                        >
                          {app.name}
                        </Typography>
                      </Link>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            )}

            {/* Show message if no linked applications */}
            {(!env.apps || env.apps.length === 0) && (
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                  <AppsIcon color="primary" />
                  Linked Applications
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                  No applications are currently linked to this environment.
                </Typography>
              </Paper>
            )}

            {/* Timestamps */}
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarIcon color="primary" />
                Timestamps
              </Typography>
              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Created At
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(env.created_at)}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Last Updated
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(env.updated_at)}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

export default function EnvironmentDetailPage() {
  return (
    <AuthGuard>
      <EnvironmentDetailContent />
    </AuthGuard>
  );
}
