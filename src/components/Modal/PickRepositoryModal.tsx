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
import { Repository } from "@/services/types";
import ReposService from "@/services/repos";

interface PickRepositoryModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (repoId: string, repoName: string, repoStatus: string) => Promise<void>;
  currentRepoId?: string;
  appOrg?: string;
}

export default function PickRepositoryModal({
  open,
  onClose,
  onSelect,
  currentRepoId,
  appOrg,
}: PickRepositoryModalProps) {
  const [repositories, setRepositories] = React.useState<Repository[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedRepoId, setSelectedRepoId] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Fetch repositories
  React.useEffect(() => {
    if (open) {
      fetchRepositories();
    }
  }, [open]);

  const fetchRepositories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ReposService.getRepos();

      if (response.success && Array.isArray(response.data)) {
        setRepositories(response.data);
      } else {
        setError("Failed to load repositories");
      }
    } catch (err) {
      console.error("Error fetching repositories:", err);
      setError("Failed to load repositories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (repoId: string) => {
    setSelectedRepoId(repoId);
  };

  const handleConfirm = async () => {
    if (!selectedRepoId) return;

    setIsSubmitting(true);
    try {
      // Find the selected repo to pass its details
      const selectedRepo = repositories.find(repo => repo.id === selectedRepoId);
      const repoName = selectedRepo?.name || "Repository";
      const repoStatus = selectedRepo?.status || "active";
      
      await onSelect(selectedRepoId, repoName, repoStatus);
      onClose();
    } catch (err) {
      console.error("Error selecting repository:", err);
      setError("Failed to link repository. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedRepoId(null);
      setSearchQuery("");
      onClose();
    }
  };

  // Filter repositories based on search
  const filteredRepositories = React.useMemo(() => {
    if (!searchQuery.trim()) return repositories;
    const query = searchQuery.toLowerCase();
    return repositories.filter(
      (repo) =>
        repo.name.toLowerCase().includes(query) ||
        repo.org?.toLowerCase().includes(query) ||
        repo.description?.toLowerCase().includes(query)
    );
  }, [repositories, searchQuery]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Pick Existing Repository</DialogTitle>
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
        ) : repositories.length === 0 ? (
          <Alert severity="info">
            No repositories found. Create a new repository first.
          </Alert>
        ) : (
          <>
            <TextField
              fullWidth
              size="small"
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mb: 2 }}
            />

            {filteredRepositories.length === 0 ? (
              <Alert severity="info">No repositories match your search.</Alert>
            ) : (
              <List sx={{ maxHeight: 400, overflow: "auto" }}>
                {filteredRepositories.map((repo) => {
                  const isCurrent = repo.id === currentRepoId;
                  return (
                    <ListItem key={repo.id} disablePadding>
                      <ListItemButton
                        onClick={() => handleSelect(repo.id)}
                        selected={selectedRepoId === repo.id}
                        disabled={isSubmitting}
                      >
                        <Radio
                          checked={selectedRepoId === repo.id}
                          disabled={isSubmitting}
                          sx={{ mr: 1 }}
                        />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                            <Typography variant="body1" fontWeight={isCurrent ? 600 : 400}>
                              {repo.name}
                            </Typography>
                            {isCurrent && (
                              <Chip label="Current" size="small" color="primary" />
                            )}
                            <Chip
                              label={repo.isPrivate === 1 ? "Private" : "Public"}
                              size="small"
                              variant="outlined"
                              color={repo.isPrivate === 1 ? "error" : "success"}
                            />
                          </Stack>
                          <Box>
                            {repo.org && (
                              <Typography variant="caption" color="text.secondary">
                                {repo.org}
                              </Typography>
                            )}
                            {repo.description && (
                              <Typography variant="caption" display="block" color="text.secondary">
                                {repo.description}
                              </Typography>
                            )}
                          </Box>
                        </Box>
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
          disabled={!selectedRepoId || isSubmitting}
        >
          {isSubmitting ? "Linking..." : "Link Repository"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

