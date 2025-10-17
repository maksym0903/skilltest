"use client";

import * as React from "react";
import { Card, CardContent, Stack, Typography, Grid, Box, CircularProgress, Alert } from "@mui/material";
import { 
  Cloud as CloudIcon,
  Storage as StorageIcon,
  Add as AddIcon
} from "@mui/icons-material";
import EnvironmentTable from "@/components/Table/EnvironmentTable";
import DeleteConfirmationDialog from "@/components/Modal/DeleteConfirmationDialog";
import { environmentsService } from "@/services/environments";
import { Environment } from "@/services/types";

export default function EnvironmentPage() {
  const [environments, setEnvironments] = React.useState<Environment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  // Delete dialog state
  const [deleteDialog, setDeleteDialog] = React.useState<{
    open: boolean;
    environment: Environment | null;
    isLoading: boolean;
  }>({
    open: false,
    environment: null,
    isLoading: false,
  });

  const fetchEnvironments = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await environmentsService.getEnvironments();
      setEnvironments(response.data);
    } catch (err) {
      console.error('Error fetching environments:', err);
      setError('Failed to load environments');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchEnvironments();
  }, [fetchEnvironments]);

  // Delete handlers
  const handleDeleteClick = (environment: Environment) => {
    console.log('Delete clicked for environment:', environment);
    setDeleteDialog({
      open: true,
      environment,
      isLoading: false,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.environment) return;

    setDeleteDialog(prev => ({ ...prev, isLoading: true }));

    try {
      await environmentsService.deleteEnvironment(deleteDialog.environment.id);
      // Remove the deleted environment from the state
      setEnvironments(prevEnvironments => prevEnvironments.filter(env => env.id !== deleteDialog.environment!.id));
      // Close dialog
      setDeleteDialog({ open: false, environment: null, isLoading: false });
      console.log('Environment deleted successfully');
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete environment. Please try again.');
    } finally {
      setDeleteDialog(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, environment: null, isLoading: false });
  };

  // Transform API data to match table format
  const rows = environments.map(env => ({
    id: env.id,
    name: env.name,
    app: env.app_id, // You might want to fetch app names separately
    branch: env.branch,
    subdomain: env.subdomain || env.amplify_app_url || '',
    status: env.status === 'active' ? 'Active' : 
            env.status === 'creating' ? 'Creating' :
            env.status === 'error' ? 'Error' : 'Inactive',
    version: env.current_version || 'N/A',
    domain: env.custom_domain || env.amplify_app_url || '',
    created_at: env.created_at || '',
    // Include original environment data for actions
    originalData: env
  }));

  // Calculate stats
  const totalEnvironments = environments.length;
  const activeEnvironments = environments.filter(env => env.status === 'active').length;
  const totalApps = new Set(environments.map(env => env.app_id)).size;

  if (loading) {
    return (
      <Stack spacing={3}>
        <Typography variant="h4" fontWeight={700}>
          Environments
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack spacing={3}>
        <Typography variant="h4" fontWeight={700}>
          Environments
        </Typography>
        <Alert severity="error">{error}</Alert>
      </Stack>
    );
  }

  return (
    <>
      <Stack spacing={3}>
        <Typography variant="h4" fontWeight={700}>
          Environments
        </Typography>
        
        {/* Stats Cards */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <CloudIcon color="primary" sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      {totalEnvironments}
                    </Typography>
                    <Typography color="text.secondary">Total Environments</Typography>
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
                      {activeEnvironments}
                    </Typography>
                    <Typography color="text.secondary">Active Environments</Typography>
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
                    <Typography variant="h4" fontWeight={700}>
                      {totalApps}
                    </Typography>
                    <Typography color="text.secondary">Total Apps</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Environment Table */}
        <EnvironmentTable 
          rows={rows} 
          onRefresh={fetchEnvironments}
          onDeleteClick={handleDeleteClick}
        />
      </Stack>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Environment"
        message="Are you sure you want to delete this environment? This action cannot be undone and will permanently remove the environment and all its associated data."
        itemName={deleteDialog.environment?.name}
        isLoading={deleteDialog.isLoading}
      />
    </>
  );
}
