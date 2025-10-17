"use client";

import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Stack,
  Chip,
} from "@mui/material";
import {
  RocketLaunch as RocketIcon,
  Cloud as CloudIcon,
  Storage as StorageIcon,
} from "@mui/icons-material";

interface DeployConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  appName: string;
  environmentName?: string;
  repositoryName?: string;
  isLoading: boolean;
}

export default function DeployConfirmationDialog({
  open,
  onClose,
  onConfirm,
  appName,
  environmentName,
  repositoryName,
  isLoading,
}: DeployConfirmationDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <RocketIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Deploy Application
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          <Typography variant="body1" color="text.secondary">
            Are you sure you want to deploy this application? This action will initiate the deployment process.
          </Typography>

          <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Application Details
            </Typography>
            <Stack spacing={1}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  App Name:
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {appName}
                </Typography>
              </Box>
              
              {environmentName && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CloudIcon fontSize="small" color="primary" />
                  <Typography variant="body2" color="text.secondary">
                    Environment:
                  </Typography>
                  <Chip 
                    label={environmentName} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                </Box>
              )}
              
              {repositoryName && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <StorageIcon fontSize="small" color="secondary" />
                  <Typography variant="body2" color="text.secondary">
                    Repository:
                  </Typography>
                  <Chip 
                    label={repositoryName} 
                    size="small" 
                    color="secondary" 
                    variant="outlined"
                  />
                </Box>
              )}
            </Stack>
          </Box>

          {(!environmentName || environmentName === 'Create Environment') && (
            <Alert severity="warning">
              No environment found for this app. Please create an environment first.
            </Alert>
          )}

          {(!repositoryName || repositoryName === 'create Repository') && (
            <Alert severity="warning">
              No repository found for this app. Please create a repository first.
            </Alert>
          )}

          <Alert severity="info">
            The deployment process may take several minutes to complete. You will be notified when finished.
          </Alert>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={isLoading}
          sx={{ minWidth: 100 }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="primary"
          disabled={isLoading || !environmentName || environmentName === 'Create Environment' || !repositoryName || repositoryName === 'create Repository'}
          startIcon={isLoading ? <CircularProgress size={16} /> : <RocketIcon />}
          sx={{ minWidth: 120 }}
        >
          {isLoading ? "Deploying..." : "Deploy"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
