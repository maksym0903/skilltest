"use client";

import * as React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Typography,
  CircularProgress,
  Stack,
  Button,
  Alert,
  Snackbar,
  Tabs,
  Tab,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import AppsService from "@/services/apps";
import { Application } from "@/services/types";
import AuthGuard from "@/components/AuthGuard";
import DeployConfirmationDialog from "@/components/Modal/DeployConfirmationDialog";
import DeleteConfirmationDialog from "@/components/Modal/DeleteConfirmationDialog";
import PickRepositoryModal from "@/components/Modal/PickRepositoryModal";
import PickEnvironmentModal from "@/components/Modal/PickEnvironmentModal";
import {
  OverviewTab,
  DeploymentTab,
  RepositoryEnvironmentTab,
} from "@/components/AppDetails";

function AppDetailContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const appId = params.id as string;

  const [app, setApp] = React.useState<Application | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  // Success notifications
  const [repoCreatedSuccess, setRepoCreatedSuccess] = React.useState(false);
  const [createdRepoName, setCreatedRepoName] = React.useState<string>("");
  const [envCreatedSuccess, setEnvCreatedSuccess] = React.useState(false);
  const [createdEnvName, setCreatedEnvName] = React.useState<string>("");
  
  
  // Deploy dialog state
  const [deployDialog, setDeployDialog] = React.useState<{
    open: boolean;
    isLoading: boolean;
  }>({
    open: false,
    isLoading: false,
  });

  // Delete dialog state
  const [deleteDialog, setDeleteDialog] = React.useState<{
    open: boolean;
    isLoading: boolean;
  }>({
    open: false,
    isLoading: false,
  });

  // Pick repository/environment modal state
  const [pickRepoModalOpen, setPickRepoModalOpen] = React.useState(false);
  const [pickEnvModalOpen, setPickEnvModalOpen] = React.useState(false);

  // Tab state
  const [activeTab, setActiveTab] = React.useState(0);


  // Fetch app details
  const fetchAppDetails = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await AppsService.getAppById(appId);
      
      if (response.success && response.data) {
        setApp(response.data);
      } else {
        setError(response.message || "Failed to load application details");
      }
    } catch (err) {
      console.error("Error fetching app details:", err);
      setError("Failed to load application details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [appId]);

  React.useEffect(() => {
    if (appId) {
      fetchAppDetails();
    }
  }, [appId, fetchAppDetails]);

  // Handle repository creation success from URL parameters
  React.useEffect(() => {
    const repoCreated = searchParams.get("repoCreated");
    const urlAppId = searchParams.get("appId");
    const repoName = searchParams.get("repoName");

    if (repoCreated === "true" && urlAppId === appId && repoName) {
      setCreatedRepoName(repoName);
      setRepoCreatedSuccess(true);

      // Refresh app details to get updated backend data
      fetchAppDetails();

      // Clear the success message after 6 seconds
      setTimeout(() => {
        setRepoCreatedSuccess(false);
        setCreatedRepoName("");
      }, 6000);
    }
  }, [searchParams, appId, fetchAppDetails]);

  // Handle environment creation success from URL parameters
  React.useEffect(() => {
    const envCreated = searchParams.get("envCreated");
    const urlAppId = searchParams.get("appId");
    const envName = searchParams.get("envName");

    if (envCreated === "true" && urlAppId === appId && envName) {
      setCreatedEnvName(envName);
      setEnvCreatedSuccess(true);

      // Refresh app details to get updated backend data
      fetchAppDetails();

      // Clear the success message after 6 seconds
      setTimeout(() => {
        setEnvCreatedSuccess(false);
        setCreatedEnvName("");
      }, 6000);
    }
  }, [searchParams, appId, fetchAppDetails]);

  const handleBack = () => {
    router.push("/apps");
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Helper functions for deployment logic
  const getDeploymentState = () => {
    const repoCreatedParam = searchParams.get("repoCreated");
    const repoNameParam = searchParams.get("repoName");
    const envCreatedParam = searchParams.get("envCreated");
    const envNameParam = searchParams.get("envName");
    const urlAppIdParam = searchParams.get("appId");
    
    const hasRepo = (repoCreatedParam === "true" && urlAppIdParam === appId && repoNameParam) || 
                   app?.repo_id;
                   
    const hasEnv = (envCreatedParam === "true" && urlAppIdParam === appId && envNameParam) || 
                  app?.env_id;
    
    const canDeploy = hasRepo && hasEnv && app?.status !== 'building';
    
    let deployTooltip = "Deploy application";
    if (!hasRepo) deployTooltip = "Create repository first";
    else if (!hasEnv) deployTooltip = "Create environment first";
    else if (app?.status === 'building') deployTooltip = "Deployment in progress";
    
    return {
      canDeploy,
      deployTooltip,
      isDeploying: app?.status === 'building'
    };
  };

  const handleDeploy = () => {
    console.log("Deploy clicked for app:", app);
    setDeployDialog({
      open: true,
      isLoading: false,
    });
  };

  const handleDeployConfirm = async () => {
    if (!app) return;

    setDeployDialog(prev => ({ ...prev, isLoading: true }));

    try {
      // Extract required IDs - priority: app state > URL params
      let environmentId = null;
      let repoId = null;
      
      // Get repo ID
      if (app.repo_id) {
        repoId = String(app.repo_id);
      } else {
        const repoCreatedParam = searchParams.get("repoCreated");
        const repoIdParam = searchParams.get("repoId");
        const urlAppIdParam = searchParams.get("appId");
        if (repoCreatedParam === "true" && urlAppIdParam === appId && repoIdParam) {
          repoId = repoIdParam;
        }
      }
      
      // Get environment ID
      if (app.env_id) {
        environmentId = String(app.env_id);
      } else {
        const envCreatedParam = searchParams.get("envCreated");
        const envIdParam = searchParams.get("envId");
        const urlAppIdParam = searchParams.get("appId");
        if (envCreatedParam === "true" && urlAppIdParam === appId && envIdParam) {
          environmentId = envIdParam;
        }
      }

      console.log("Deploy validation - App data:", {
        appId,
        environmentId,
        repoId,
        fromUrlParams: {
          envId: searchParams.get("envId"),
          repoId: searchParams.get("repoId")
        },
        fullApp: app
      });

      // Validate required data
      if (!environmentId) {
        throw new Error("No environment found for this app. Please create an environment first.");
      }
      if (!repoId) {
        throw new Error("No repository found for this app. Please create a repository first.");
      }

      // Call the deploy API with proper parameters
      const response = await AppsService.deployApp(
        appId,
        environmentId,
        repoId,
        { buildCommand: "npm run build", baseDirectory: "dist" },
        { NODE_ENV: "production", API_URL: "https://api.myapp.com" },
        { "X-Custom-Header": "value" }
      );

      if (response.success) {
        const deploymentData = response.data;
        
        // Close the dialog
        setDeployDialog({ open: false, isLoading: false });
        
        // Update the app status to building and add URL if provided
        setApp(prevApp => {
          if (!prevApp) return prevApp;
          return {
            ...prevApp,
            status: 'building',
            deployed_url: deploymentData?.deployed_url || prevApp.deployed_url
          };
        });
        
        // Simulate deployment completion after 2.5 minutes
        setTimeout(() => {
          setApp(prevApp => {
            if (!prevApp) return prevApp;
            return {
              ...prevApp,
              status: 'active'
            };
          });
        }, 150000);
      } else {
        throw new Error(response.message || "Deployment failed");
      }
    } catch (error) {
      console.error("Deployment failed:", error);
      alert(`Deployment failed: ${error instanceof Error ? error.message : "Please try again."}`);
    } finally {
      setDeployDialog(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeployCancel = () => {
    setDeployDialog({ open: false, isLoading: false });
  };

  const handleDeleteClick = () => {
    console.log("Delete clicked for app:", app);
    setDeleteDialog({
      open: true,
      isLoading: false,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!app) return;

    setDeleteDialog(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await AppsService.deleteApp(appId);
      if (response.success) {
        setDeleteDialog({ open: false, isLoading: false });
        router.push("/apps");
      } else {
        alert("Failed to delete application. Please try again.");
      }
    } catch (err) {
      console.error("Error deleting app:", err);
      alert("Failed to delete application. Please try again.");
    } finally {
      setDeleteDialog(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, isLoading: false });
  };

  const handleOpenUrl = () => {
    if (app?.deployed_url) {
      window.open(app.deployed_url, "_blank");
    }
  };

  const handlePickRepository = async (repoId: string, repoName: string, repoStatus: string) => {
    if (!app) return;

    try {
      const response = await AppsService.updateApp(appId, {
        repo_id: repoId
      });

      if (response.success) {
        // Close modal
        setPickRepoModalOpen(false);
        
        // Redirect with URL params (same as create flow)
        const queryParams = new URLSearchParams({
          repoCreated: 'true',
          appId: appId,
          repoId: repoId,
          repoName: repoName,
          repoStatus: repoStatus
        });
        
        router.push(`/apps/${appId}?${queryParams.toString()}`);
      } else {
        throw new Error(response.message || "Failed to link repository");
      }
    } catch (err) {
      console.error("Error linking repository:", err);
      alert("Failed to link repository. Please try again.");
      throw err;
    }
  };

  const handlePickEnvironment = async (envId: string, envName: string, envStatus: string) => {
    if (!app) return;

    try {
      const response = await AppsService.updateApp(appId, {
        env_id: envId
      });

      if (response.success) {
        // Close modal
        setPickEnvModalOpen(false);
        
        // Redirect with URL params (same as create flow)
        const queryParams = new URLSearchParams({
          envCreated: 'true',
          appId: appId,
          envId: envId,
          envName: envName,
          envStatus: envStatus
        });
        
        router.push(`/apps/${appId}?${queryParams.toString()}`);
      } else {
        throw new Error(response.message || "Failed to link environment");
      }
    } catch (err) {
      console.error("Error linking environment:", err);
      alert("Failed to link environment. Please try again.");
      throw err;
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !app) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || "Application not found"}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back to Apps
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back to Apps
        </Button>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          <Box>
            <Typography variant="h4" gutterBottom>
              {app.name}
            </Typography>
            {app.description && (
              <Typography variant="body1" color="text.secondary">
                {app.description}
              </Typography>
            )}
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteClick}
            >
              Delete
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Main Content - Tabs */}
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="app detail tabs">
            <Tab label="Overview" />
            <Tab label="Deployment" />
            <Tab label="Repository & Environment" />
          </Tabs>
        </Box>
        
        {/* Tab Content */}
        <Box sx={{ mt: 3 }}>
          {activeTab === 0 && <OverviewTab app={app} searchParams={searchParams} appId={appId} />}
          {activeTab === 1 && (
            <DeploymentTab
              app={app}
              onDeploy={handleDeploy}
              onOpenUrl={handleOpenUrl}
              canDeploy={getDeploymentState().canDeploy || false}
              deployTooltip={getDeploymentState().deployTooltip}
              isDeploying={getDeploymentState().isDeploying || false}
            />
          )}
          {activeTab === 2 && (
            <RepositoryEnvironmentTab
              app={app}
              appId={appId}
              searchParams={searchParams}
              onPickRepository={() => setPickRepoModalOpen(true)}
              onPickEnvironment={() => setPickEnvModalOpen(true)}
            />
          )}
        </Box>
      </Box>

      {/* Deploy Confirmation Dialog */}
      <DeployConfirmationDialog
        open={deployDialog.open}
        onClose={handleDeployCancel}
        onConfirm={handleDeployConfirm}
        appName={app.name || ""}
        environmentName={
          app.env_id && app.environments
            ? app.environments.find((env) => env.id === app.env_id)?.name
            : undefined
        }
        repositoryName={
          app.repo_id && app.repositories
            ? app.repositories.find((repo) => repo.id === app.repo_id)?.name
            : undefined
        }
        isLoading={deployDialog.isLoading}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Application"
        message="Are you sure you want to delete this application? This action cannot be undone and will permanently remove the application and all its associated data."
        itemName={app.name}
        isLoading={deleteDialog.isLoading}
      />

      {/* Success Snackbar for Repository Creation */}
      <Snackbar
        open={repoCreatedSuccess}
        autoHideDuration={6000}
        onClose={() => setRepoCreatedSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setRepoCreatedSuccess(false)} 
          severity="success" 
          sx={{ width: '100%' }}
          variant="filled"
        >
          Repository &ldquo;{createdRepoName}&rdquo; created successfully! The app has been updated. ✅
        </Alert>
      </Snackbar>

      {/* Success Snackbar for Environment Creation */}
      <Snackbar
        open={envCreatedSuccess}
        autoHideDuration={6000}
        onClose={() => setEnvCreatedSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setEnvCreatedSuccess(false)} 
          severity="success" 
          sx={{ width: '100%' }}
          variant="filled"
        >
          Environment &ldquo;{createdEnvName}&rdquo; created successfully! The app has been updated. 🚀
        </Alert>
      </Snackbar>

      {/* Pick Repository Modal */}
      <PickRepositoryModal
        open={pickRepoModalOpen}
        onClose={() => setPickRepoModalOpen(false)}
        onSelect={handlePickRepository}
        currentRepoId={app?.repo_id}
        appOrg={app?.org || undefined}
      />

      {/* Pick Environment Modal */}
      <PickEnvironmentModal
        open={pickEnvModalOpen}
        onClose={() => setPickEnvModalOpen(false)}
        onSelect={handlePickEnvironment}
        currentEnvId={app?.env_id}
        appId={appId}
      />
    </Box>
  );
}

export default function AppDetailPage() {
  return (
    <AuthGuard>
      <AppDetailContent />
    </AuthGuard>
  );
}

