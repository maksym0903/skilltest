"use client";

import * as React from "react";
import {
  Card, CardContent, Stack, TextField, Button, Typography, Box, Alert, FormControl, InputLabel, Select, MenuItem, CircularProgress
} from "@mui/material";
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ReposService from "@/services/repos";
import AppsService from "@/services/apps";
import GitHubConnection from "@/components/Buttons/GitHubConnection";
import GitHubService, { GitHubStatusResponse } from "@/services/github";

export default function CreateRepoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // GitHub connection status
  const [gitHubConnected, setGitHubConnected] = React.useState(false);
  const [gitHubLoading, setGitHubLoading] = React.useState(true);
  
  // Initialize form data immediately when query parameters are present
  React.useEffect(() => {
    const appIdFromQuery = searchParams.get("appId");
    
    // Immediately set form data if query params exist
    if (appIdFromQuery) {
      setFormData(prev => ({
        ...prev,
        appId: appIdFromQuery || prev.appId,
      }));
    }
  }, [searchParams]);

  // Check GitHub connection status
  const checkGitHubStatus = React.useCallback(async () => {
    try {
      setGitHubLoading(true);
      const response: GitHubStatusResponse = await GitHubService.getConnectionStatus();
      setGitHubConnected(response.success && response.data.connected);
    } catch (error) {
      console.error('Failed to check GitHub status:', error);
      setGitHubConnected(false);
    } finally {
      setGitHubLoading(false);
    }
  }, []);

  // Fetch organization names on component mount (only if GitHub is connected)
  React.useEffect(() => {
    const fetchOrganizationNames = async () => {
      if (!gitHubConnected) return;
      
      setLoadingOrgs(true);
      try {
        const response = await ReposService.getOrganizationNames();
        setOrganizationNames(response.organization_names);
      } catch (error) {
        console.error('Error fetching organization names:', error);
        setError('Failed to load organization names');
      } finally {
        setLoadingOrgs(false);
      }
    };

    fetchOrganizationNames();
  }, [gitHubConnected]);

  // Check GitHub status on mount
  React.useEffect(() => {
    checkGitHubStatus();
  }, [checkGitHubStatus]);
  
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    isPrivate: "Private",
    appId: "",
    org: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [organizationNames, setOrganizationNames] = React.useState<string[]>([]);
  const [loadingOrgs, setLoadingOrgs] = React.useState(false);

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSelectChange = (field: string) => (event: { target: { value: string; name: string } }) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Debug: Log current form data
    console.log('Form submission - Current form data:', formData);
    
    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare request body according to API specification
      const requestBody: {
        name: string;
        description?: string;
        isPrivate: boolean;
        appId?: string;
        org: string;
        code?: string;
      } = {
        name: formData.name,
        description: formData.description,
        isPrivate: formData.isPrivate === "Private",
        org: formData.org,
      };


      // Only add appId if it's not empty
      if (formData.appId && formData.appId.trim()) {
        requestBody.appId = formData.appId;
      }

      console.log("Creating repository with data:", requestBody);
      
      // Step 1: Create the repository
      const response = await ReposService.createRepo(requestBody);
      console.log("Repository created successfully:", response);
      
      // Step 2: If coming from app detail page, link the repo to the app
      const returnTo = searchParams.get("returnTo");
      if (returnTo === "appDetail" && formData.appId && response.id) {
        console.log("Linking repository to app:", formData.appId, "->", response.id);
        
        try {
          const updateResponse = await AppsService.updateApp(formData.appId, {
            repo_id: response.id
          });
          console.log("App updated with repository link:", updateResponse);
        } catch (updateError) {
          console.error("Failed to link repository to app:", updateError);
          // Continue with the flow even if linking fails
          // User can still see the repo was created via URL params
        }
      }
      
      setSuccess(true);
      setIsSubmitting(false);

      // Redirect based on where user came from
      let redirectPath = "/repos";
      
      if (returnTo === "apps") {
        redirectPath = "/apps";
      } else if (returnTo === "appDetail") {
        redirectPath = `/apps/${formData.appId}`;
      }
      
      // If redirecting to apps page or app detail, include repository info in URL
      if (returnTo === "apps" || returnTo === "appDetail") {
        const repoInfo = {
          appId: formData.appId,
          repoId: response.id,
          repoName: response.name,
          repoStatus: response.status
        };
        
        const queryParams = new URLSearchParams({
          repoCreated: 'true',
          appId: repoInfo.appId,
          repoId: repoInfo.repoId,
          repoName: repoInfo.repoName,
          repoStatus: repoInfo.repoStatus
        });
        
        setTimeout(() => {
          router.push(`${redirectPath}?${queryParams.toString()}`);
        }, 1500);
      } else {
        setTimeout(() => {
          router.push(redirectPath);
        }, 1500);
      }
    } catch (error) {
      console.error('Error creating repository:', error);
      setError('Failed to create repository. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking GitHub connection
  if (gitHubLoading) {
    return (
      <Stack spacing={3}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            component={Link}
            href={
              searchParams.get("returnTo") === "apps" 
                ? "/apps" 
                : searchParams.get("returnTo") === "appDetail"
                ? `/apps/${searchParams.get("appId")}`
                : "/repos"
            }
            startIcon={<ArrowBackIcon />}
            variant="outlined"
          >
            {searchParams.get("returnTo") === "apps" 
              ? "Back to Apps" 
              : searchParams.get("returnTo") === "appDetail"
              ? "Back to App Detail"
              : "Back to Repos"}
          </Button>
          <Typography variant="h4" fontWeight={700}>
            Create New Repository
          </Typography>
        </Box>
        <Card>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ py: 4 }}>
              <CircularProgress size={24} />
              <Typography variant="body1" color="text.secondary">
                Checking GitHub connection...
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          component={Link}
          href={
            searchParams.get("returnTo") === "apps" 
              ? "/apps" 
              : searchParams.get("returnTo") === "appDetail"
              ? `/apps/${searchParams.get("appId")}`
              : "/repos"
          }
          startIcon={<ArrowBackIcon />}
          variant="outlined"
        >
          {searchParams.get("returnTo") === "apps" 
            ? "Back to Apps" 
            : searchParams.get("returnTo") === "appDetail"
            ? "Back to App Detail"
            : "Back to Repos"}
        </Button>
        <Typography variant="h4" fontWeight={700}>
          Create New Repository
        </Typography>
      </Box>

      {success && (
        <Alert severity="success">
          Repository created successfully! Redirecting to repos page...
        </Alert>
      )}

      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      {/* GitHub Connection Section */}
      <Card>
        <CardContent>
          <Stack direction={{ xs: "column", sm: "row" }} gap={2} sx={{ mb: 2 }} alignItems={{ xs: "stretch", sm: "center" }}>
            <GitHubConnection 
              size="small" 
              fullWidth={{ xs: true, sm: false }}
              sx={{ minWidth: { xs: "auto", sm: 140 } }}
            />
          </Stack>

          {/* Show message when GitHub is not connected */}
          {!gitHubConnected && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body1" fontWeight={600}>
                GitHub Connection Required
              </Typography>
              <Typography variant="body2">
                Please connect your GitHub account to create a new repository.
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Show form only when GitHub is connected */}
      {gitHubConnected && (
        <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Repository Name"
                value={formData.name}
                onChange={handleInputChange("name")}
                placeholder="my-awesome-repo"
                required
                helperText="Choose a descriptive name for your repository"
              />

              <FormControl fullWidth required>
                <InputLabel>Organization</InputLabel>
                <Select
                  value={formData.org}
                  onChange={handleSelectChange("org")}
                  label="Organization"
                  disabled={loadingOrgs}
                >
                  {organizationNames.map((orgName) => (
                    <MenuItem key={orgName} value={orgName}>
                      {orgName}
                    </MenuItem>
                  ))}
                </Select>
                {loadingOrgs && <Typography variant="caption" sx={{ mt: 1 }}>Loading organizations...</Typography>}
              </FormControl>

              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={handleInputChange("description")}
                placeholder="Repository description"
                multiline
                rows={3}
                helperText="Optional description for your repository"
              />


              <TextField
                fullWidth
                label="App ID"
                value={formData.appId}
                onChange={handleInputChange("appId")}
                placeholder="app_123"
                disabled={!!searchParams.get("appId")}
                helperText={searchParams.get("appId") ? "App ID automatically filled from selected app" : "Enter the application ID this repository belongs to (optional)"}
              />

              <FormControl fullWidth required>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.isPrivate}
                  onChange={handleSelectChange("isPrivate")}
                  label="Type"
                >
                  <MenuItem value="Private">Private</MenuItem>
                  <MenuItem value="Public">Public</MenuItem>
                </Select>
              </FormControl>


        

              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  component={Link}
                  href={
                    searchParams.get("returnTo") === "apps" 
                      ? "/apps" 
                      : searchParams.get("returnTo") === "appDetail"
                      ? `/apps/${searchParams.get("appId")}`
                      : "/repos"
                  }
                  variant="outlined"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={
                    isSubmitting || 
                    !formData.name.trim() || 
                    !formData.org.trim() ||
                    !formData.isPrivate.trim()
                  }
                >
                  {isSubmitting ? "Creating..." : "Create Repository"}
                </Button>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>
      )}

    </Stack>
  );
}
