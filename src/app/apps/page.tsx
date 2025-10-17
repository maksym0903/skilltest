"use client";

import * as React from "react";
import {
  Stack, Typography, Grid, Card, CardContent, Box, Alert, CircularProgress, Snackbar
} from "@mui/material";
import { 
  Add as AddIcon, 
  Cloud as CloudIcon, 
  Storage as StorageIcon
} from "@mui/icons-material";
import AdoptAppModal from "@/components/Modal/AdoptAppModal";
import AppsTable from "@/components/Table/AppsTable";
import AppsService from "@/services/apps";
import type { Application } from "@/services/types";

// Use Application type directly from API response
type AppData = Application;
import { useSearchParams } from "next/navigation";



export default function AppsPage() {
  const searchParams = useSearchParams();
  const [adoptModalOpen, setAdoptModalOpen] = React.useState(false);
  const [apps, setApps] = React.useState<AppData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [envCreatedSuccess, setEnvCreatedSuccess] = React.useState(false);
  const [createdEnvName, setCreatedEnvName] = React.useState<string>("");
  const [repoCreatedSuccess, setRepoCreatedSuccess] = React.useState(false);
  const [createdRepoName, setCreatedRepoName] = React.useState<string>("");
  const [adoptSuccess, setAdoptSuccess] = React.useState(false);
  const [adoptedAppName, setAdoptedAppName] = React.useState<string>("");

  // Fetch apps from API
  const fetchApps = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await AppsService.getApps();
      
      if (response.success) {
        // Use API response directly - no transformation needed
        setApps(response.data);
      } else {
        setError('Failed to fetch applications');
      }
    } catch (err) {
      console.error('Error fetching apps:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle environment creation success from URL parameters
  React.useEffect(() => {
    const envCreated = searchParams.get("envCreated");
    const appId = searchParams.get("appId");
    const envName = searchParams.get("envName");

    if (envCreated === "true" && appId && envName) {
      setCreatedEnvName(envName);
      setEnvCreatedSuccess(true);
      
      // Refresh apps data to get updated backend info
      fetchApps();

      // Clear the success message after 6 seconds
      setTimeout(() => {
        setEnvCreatedSuccess(false);
        setCreatedEnvName("");
      }, 6000);
    }
  }, [searchParams, fetchApps]);

  // Handle repository creation success from URL parameters
  React.useEffect(() => {
    const repoCreated = searchParams.get("repoCreated");
    const appId = searchParams.get("appId");
    const repoName = searchParams.get("repoName");

    if (repoCreated === "true" && appId && repoName) {
      setCreatedRepoName(repoName);
      setRepoCreatedSuccess(true);
      
      // Refresh apps data to get updated backend info
      fetchApps();

      // Clear the success message after 6 seconds
      setTimeout(() => {
        setRepoCreatedSuccess(false);
        setCreatedRepoName("");
      }, 6000);
    }
  }, [searchParams, fetchApps]);

  // Fetch apps on component mount
  React.useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const handleAdoptApp = async (appName: string, appDescription: string, org: string, repoId: string) => {
    console.log("Adopting app:", { appName, appDescription, org, repoId });
    
    try {
      const requestData = {
        name: appName,
        description: appDescription,
        org: org,
        repo_id: repoId, // Now using the actual repository ID
        creation_type: 'adopt_app' as const,
      };

      console.log("Creating adopted app with data:", requestData);
      
      // Call the API to create the adopted app
      const response = await AppsService.createApp(requestData);
      
      if (response.success) {
        console.log("App adopted successfully:", response);
        // Show success notification
        setAdoptedAppName(appName);
        setAdoptSuccess(true);
        // Refresh the apps list
        fetchApps();
        // Close the modal
        setAdoptModalOpen(false);
      } else {
        throw new Error(response.message || "Failed to adopt app");
      }
      
    } catch (error) {
      console.error("Error adopting app:", error);
      // You might want to show an error message here
      alert(`Failed to adopt app: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Stack spacing={3} alignItems="center" sx={{ py: 4 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading applications...
        </Typography>
      </Stack>
    );
  }

  // Show error state
  if (error) {
    return (
      <Stack spacing={3}>
        <Typography variant="h4" fontWeight={700}>
          Application List
        </Typography>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <button onClick={fetchApps}>
            Retry
          </button>
        </Box>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={700}>
        Application List
      </Typography>

      {/* Removed Alerts - now using Snackbar popups below */}

      {/* Stats Cards */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <CloudIcon color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {apps.filter(app => app.deployed_url).length}
                  </Typography>
                  <Typography color="text.secondary">Running Apps</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <StorageIcon color="secondary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {apps.length}
                  </Typography>
                  <Typography color="text.secondary">Total Applications</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <AddIcon color="success" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {apps.length}
                  </Typography>
                  <Typography color="text.secondary">Total Apps</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Data Table */}
      <AppsTable
        rows={apps}
        onAdoptClick={() => setAdoptModalOpen(true)}
        onRowsUpdate={(updatedRows) => setApps(updatedRows)}
      />

      {/* Adopt App Modal */}
      <AdoptAppModal
        open={adoptModalOpen}
        onClose={() => setAdoptModalOpen(false)}
        onAdopt={handleAdoptApp}
      />

      {/* Success Snackbar for Adopt Application */}
      <Snackbar
        open={adoptSuccess}
        autoHideDuration={6000}
        onClose={() => setAdoptSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setAdoptSuccess(false)} 
          severity="success" 
          sx={{ width: '100%' }}
          variant="filled"
        >
          Application &ldquo;{adoptedAppName}&rdquo; adopted successfully! 🎉
        </Alert>
      </Snackbar>

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
    </Stack>
  );
}

