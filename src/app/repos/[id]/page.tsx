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
  GitHub as GitHubIcon,
  Visibility as VisibilityIcon,
  Lock as LockIcon,
  Code as CodeIcon,
  Storage as StorageIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";
import Link from "next/link";
import ReposService from "@/services/repos";
import { Repository } from "@/services/types";
import AuthGuard from "@/components/AuthGuard";

function RepoDetailContent() {
  const params = useParams();
  const router = useRouter();
  const repoId = params.id as string;

  const [repo, setRepo] = React.useState<Repository | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch repository details
  const fetchRepoDetails = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ReposService.getRepoById(repoId);
      
      if (response.success && response.data) {
        setRepo(response.data);
      } else {
        setError(response.message || "Failed to load repository details");
      }
    } catch (err) {
      console.error("Error fetching repo details:", err);
      setError("Failed to load repository details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [repoId]);

  React.useEffect(() => {
    if (repoId) {
      fetchRepoDetails();
    }
  }, [repoId, fetchRepoDetails]);

  const handleBack = () => {
    router.push("/repos");
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Show loading state
  if (loading) {
    return (
      <Stack spacing={3} alignItems="center" sx={{ py: 4 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading repository details...
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
            Back to Repositories
          </Button>
          <Typography variant="h4" fontWeight={700}>
            Repository Details
          </Typography>
        </Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <Button onClick={fetchRepoDetails} variant="contained">
            Retry
          </Button>
        </Box>
      </Stack>
    );
  }

  if (!repo) {
    return (
      <Stack spacing={3}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            variant="outlined"
          >
            Back to Repositories
          </Button>
          <Typography variant="h4" fontWeight={700}>
            Repository Details
          </Typography>
        </Box>
        <Alert severity="warning">
          Repository not found.
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
          Back to Repositories
        </Button>
        <Typography variant="h4" fontWeight={700}>
          Repository Details
        </Typography>
      </Box>

      {/* Repository Information */}
      <Card>
        <CardContent>
          <Stack spacing={3}>
            {/* Repository Name and Status */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
              <Typography variant="h5" fontWeight={600}>
                {repo.name}
              </Typography>
              <Chip
                label={repo.status}
                color={repo.status === "active" ? "success" : "default"}
                size="small"
              />
              <Chip
                icon={repo.isPrivate ? <LockIcon /> : <VisibilityIcon />}
                label={repo.isPrivate ? "Private" : "Public"}
                color={repo.isPrivate ? "warning" : "info"}
                size="small"
                variant="outlined"
              />
            </Box>

            {/* Description */}
            {repo.description && (
              <Typography variant="body1" color="text.secondary">
                {repo.description}
              </Typography>
            )}

            {/* Repository URL */}
            {repo.url && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <GitHubIcon color="action" />
                <Button
                  component="a"
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="text"
                  startIcon={<OpenInNewIcon />}
                  sx={{ textTransform: "none", p: 0 }}
                >
                  {repo.url}
                </Button>
              </Box>
            )}

            <Divider />

            {/* Repository Details Grid */}
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Paper sx={{ p: 2 }}>
                  <Stack spacing={2}>
                    <Typography variant="h6" fontWeight={600} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CodeIcon color="primary" />
                      Repository Information
                    </Typography>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Repository ID
                      </Typography>
                      <Typography variant="body1" fontFamily="monospace">
                        {repo.id}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Organization
                      </Typography>
                      <Typography variant="body1">
                        {repo.org || "Not specified"}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Owner
                      </Typography>
                      <Typography variant="body1">
                        {repo.owner || "Not specified"}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Default Branch
                      </Typography>
                      <Typography variant="body1" fontFamily="monospace">
                        {repo.defaultBranch || "main"}
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
                      Repository Status
                    </Typography>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Status
                      </Typography>
                      <Chip
                        label={repo.status}
                        color={repo.status === "active" ? "success" : "default"}
                        size="small"
                      />
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Visibility
                      </Typography>
                      <Chip
                        icon={repo.isPrivate ? <LockIcon /> : <VisibilityIcon />}
                        label={repo.isPrivate ? "Private" : "Public"}
                        color={repo.isPrivate ? "warning" : "info"}
                        size="small"
                        variant="outlined"
                      />
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Branches
                      </Typography>
                      <Typography variant="body1">
                        {repo.branches?.length || 0} branch{repo.branches?.length !== 1 ? 'es' : ''}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Alias
                      </Typography>
                      <Typography variant="body1">
                        {repo.alias || "Not set"}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Box>
            </Box>

            {/* Branches */}
            {repo.branches && repo.branches.length > 0 && (
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                  <CodeIcon color="primary" />
                  Branches
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {repo.branches.map((branch, index) => (
                    <Chip
                      key={index}
                      label={branch}
                      size="small"
                      variant={branch === repo.defaultBranch ? "filled" : "outlined"}
                      color={branch === repo.defaultBranch ? "primary" : "default"}
                    />
                  ))}
                </Stack>
              </Paper>
            )}

            {/* Linked Applications */}
            {repo.apps && repo.apps.length > 0 && (
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                  <StorageIcon color="primary" />
                  Linked Applications
                </Typography>
                <Stack spacing={1}>
                  {repo.apps.map((app) => (
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
            {(!repo.apps || repo.apps.length === 0) && (
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                  <StorageIcon color="primary" />
                  Linked Applications
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                  No applications are currently linked to this repository.
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
                    {formatDate(repo.createdAt)}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Last Updated
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(repo.createdAt)} {/* Assuming createdAt is the last update for now */}
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

export default function RepoDetailPage() {
  return (
    <AuthGuard>
      <RepoDetailContent />
    </AuthGuard>
  );
}
