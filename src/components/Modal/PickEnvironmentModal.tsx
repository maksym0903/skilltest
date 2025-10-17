"use client";

import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Radio,
  CircularProgress,
  Alert,
  Box,
  Typography,
  Chip,
  TextField,
  Stack,
} from "@mui/material";
import { Environment } from "@/services/types";
import { environmentsService } from "@/services/environments";

interface PickEnvironmentModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (envId: string, envName: string, envStatus: string) => Promise<void>;
  currentEnvId?: string;
  appId?: string;
}

export default function PickEnvironmentModal({
  open,
  onClose,
  onSelect,
  currentEnvId,
  appId,
}: PickEnvironmentModalProps) {
  const [environments, setEnvironments] = React.useState<Environment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedEnvId, setSelectedEnvId] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Fetch environments
  React.useEffect(() => {
    if (open) {
      fetchEnvironments();
    }
  }, [open]);

  const fetchEnvironments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await environmentsService.getEnvironments();

      if (response.success && Array.isArray(response.data)) {
        setEnvironments(response.data);
      } else {
        setError("Failed to load environments");
      }
    } catch (err) {
      console.error("Error fetching environments:", err);
      setError("Failed to load environments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (envId: string) => {
    setSelectedEnvId(envId);
  };

  const handleConfirm = async () => {
    if (!selectedEnvId) return;

    setIsSubmitting(true);
    try {
      // Find the selected env to pass its details
      const selectedEnv = environments.find(env => env.id === selectedEnvId);
      const envName = selectedEnv?.name || "Environment";
      const envStatus = selectedEnv?.status || "active";
      
      await onSelect(selectedEnvId, envName, envStatus);
      onClose();
    } catch (err) {
      console.error("Error selecting environment:", err);
      setError("Failed to link environment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedEnvId(null);
      setSearchQuery("");
      onClose();
    }
  };

  // Filter environments based on search
  const filteredEnvironments = React.useMemo(() => {
    if (!searchQuery.trim()) return environments;
    const query = searchQuery.toLowerCase();
    return environments.filter(
      (env) =>
        env.name.toLowerCase().includes(query) ||
        env.branch?.toLowerCase().includes(query) ||
        env.subdomain?.toLowerCase().includes(query)
    );
  }, [environments, searchQuery]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Pick Existing Environment</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 4,
            }}
          >
            <CircularProgress />
          </Box>
        ) : environments.length === 0 ? (
          <Alert severity="info">
            No environments found. Create a new environment first.
          </Alert>
        ) : (
          <>
            <TextField
              fullWidth
              size="small"
              placeholder="Search environments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mb: 2 }}
            />

            {filteredEnvironments.length === 0 ? (
              <Alert severity="info">No environments match your search.</Alert>
            ) : (
              <List sx={{ maxHeight: 400, overflow: "auto" }}>
                {filteredEnvironments.map((env) => {
                  const isCurrent = env.id === currentEnvId;
                  return (
                    <ListItem key={env.id} disablePadding>
                      <ListItemButton
                        onClick={() => handleSelect(env.id)}
                        selected={selectedEnvId === env.id}
                        disabled={isSubmitting}
                      >
                        <Radio
                          checked={selectedEnvId === env.id}
                          disabled={isSubmitting}
                          sx={{ mr: 1 }}
                        />
                        <ListItemText
                          primary={
                            <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Typography variant="body1" fontWeight={isCurrent ? 600 : 400} component="span">
                                {env.name}
                              </Typography>
                              {isCurrent && (
                                <Chip label="Current" size="small" color="primary" />
                              )}
                              <Chip
                                label={env.status || "Unknown"}
                                size="small"
                                variant="outlined"
                                color={
                                  env.status === "Active" || env.status === "active"
                                    ? "success"
                                    : "default"
                                }
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              {env.branch && (
                                <Typography variant="caption" display="block" color="text.secondary">
                                  Branch: {env.branch}
                                </Typography>
                              )}
                              {env.subdomain && (
                                <Typography variant="caption" display="block" color="text.secondary">
                                  Subdomain: {env.subdomain}
                                </Typography>
                              )}
                              {env.aws_account_id && (
                                <Typography variant="caption" display="block" color="text.secondary">
                                  AWS: {env.aws_account_id}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!selectedEnvId || isSubmitting}
        >
          {isSubmitting ? "Linking..." : "Link Environment"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

