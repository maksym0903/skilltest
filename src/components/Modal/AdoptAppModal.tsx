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
  Stack,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Chip,
  TextField,
} from "@mui/material";
import {
  Close as CloseIcon,
  AccountTree as OrgIcon,
  Storage as RepoIcon,
  AppRegistration as AppIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import { ReposService } from "../../services/repos";
import { Repository } from "../../services/types";
import AdoptApplicationButton from "../Buttons/AdoptApplicationButton";

interface AdoptAppModalProps {
  open: boolean;
  onClose: () => void;
  onAdopt: (appName: string, appDescription: string, org: string, repo: string) => void;
}

// Interface for organization with repositories
interface OrgWithRepos {
  org: string;
  repos: Repository[];
}

export default function AdoptAppModal({ open, onClose, onAdopt }: AdoptAppModalProps) {
  // State management
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [orgsWithRepos, setOrgsWithRepos] = React.useState<OrgWithRepos[]>([]);
  const [selectedOrg, setSelectedOrg] = React.useState<string>("");
  const [selectedRepo, setSelectedRepo] = React.useState<string>("");
  const [appName, setAppName] = React.useState<string>("");
  const [appDescription, setAppDescription] = React.useState<string>("");

  // Load repositories data when modal opens
  React.useEffect(() => {
    if (open) {
      loadRepositories();
    }
  }, [open]);

  // Reset selections when modal closes
  React.useEffect(() => {
    if (!open) {
      setSelectedOrg("");
      setSelectedRepo("");
      setAppName("");
      setAppDescription("");
      setError(null);
    }
  }, [open]);

  // Reset repo selection when org changes
  React.useEffect(() => {
    setSelectedRepo("");
  }, [selectedOrg]);

  const loadRepositories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ReposService.getRepos();
      
      // Group repositories by organization
      const orgMap = new Map<string, Repository[]>();
      response.data.forEach((repo) => {
        if (!orgMap.has(repo.org)) {
          orgMap.set(repo.org, []);
        }
        orgMap.get(repo.org)!.push(repo);
      });

      // Convert to array format
      const orgsArray: OrgWithRepos[] = Array.from(orgMap.entries()).map(([org, repos]) => ({
        org,
        repos: repos.sort((a, b) => a.name.localeCompare(b.name))
      }));

      setOrgsWithRepos(orgsArray.sort((a, b) => a.org.localeCompare(b.org)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load repositories");
      console.error("Error loading repositories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdopt = () => {
    if (appName.trim() && selectedOrg && selectedRepo) {
      // Find the selected repository to get its ID
      const selectedRepoData = availableRepos.find(repo => repo.name === selectedRepo);
      const repoId = selectedRepoData?.id || selectedRepo; // Fallback to repo name if ID not found
      
      onAdopt(appName.trim(), appDescription.trim(), selectedOrg, repoId);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedOrg("");
    setSelectedRepo("");
    setAppName("");
    setAppDescription("");
    setError(null);
    onClose();
  };

  // Get repositories for selected organization
  const availableRepos = React.useMemo(() => {
    const org = orgsWithRepos.find(o => o.org === selectedOrg);
    return org ? org.repos : [];
  }, [selectedOrg, orgsWithRepos]);

  // Check if adopt button should be enabled
  const canAdopt = appName.trim() && selectedOrg && selectedRepo;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: "400px",
        },
      }}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" fontWeight={600}>
            Adopt an Application
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ pt: 2 }}>
          {/* Error Alert */}
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Loading State */}
          {loading && (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          )}

          {/* Organization and Repository Selection */}
          {!loading && (
        <Stack spacing={3}>
              {/* App Name Input */}
          <TextField
            fullWidth
                label="Application Name"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="Enter application name"
                required
            InputProps={{
              startAdornment: (
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                      <AppIcon fontSize="small" color="primary" />
                    </Box>
                  ),
                }}
                helperText="Choose a unique name for your application"
              />

              {/* App Description Input */}
              <TextField
                fullWidth
                label="Application Description"
                value={appDescription}
                onChange={(e) => setAppDescription(e.target.value)}
                placeholder="Enter application description (optional)"
                multiline
                rows={3}
                InputProps={{
                  startAdornment: (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mr: 1, mt: 1 }}>
                      <DescriptionIcon fontSize="small" color="primary" />
                    </Box>
                  ),
                }}
                helperText="Describe what your application does"
              />

              {/* Organization Dropdown */}
              <FormControl fullWidth>
                <InputLabel id="org-select-label">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <OrgIcon fontSize="small" />
                    <span>Select Organization</span>
                  </Stack>
                </InputLabel>
                <Select
                  labelId="org-select-label"
                  value={selectedOrg}
                  label="Select Organization"
                  onChange={(e) => setSelectedOrg(e.target.value)}
                  disabled={loading || orgsWithRepos.length === 0}
                >
                  {orgsWithRepos.map((orgData) => (
                    <MenuItem key={orgData.org} value={orgData.org}>
                      <Stack direction="row" alignItems="center" spacing={1} width="100%">
                        <OrgIcon fontSize="small" color="primary" />
                        <Typography variant="body1">{orgData.org}</Typography>
                        <Chip 
                          label={`${orgData.repos.length} repo${orgData.repos.length !== 1 ? 's' : ''}`}
                          size="small" 
                          variant="outlined"
                          sx={{ ml: 'auto' }}
                        />
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Repository Dropdown */}
              <FormControl fullWidth disabled={!selectedOrg}>
                <InputLabel id="repo-select-label">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <RepoIcon fontSize="small" />
                    <span>Select Repository</span>
                  </Stack>
                </InputLabel>
                <Select
                  labelId="repo-select-label"
                  value={selectedRepo}
                  label="Select Repository"
                  onChange={(e) => setSelectedRepo(e.target.value)}
                  disabled={!selectedOrg || availableRepos.length === 0}
                >
                  {availableRepos.map((repo) => (
                    <MenuItem key={repo.id} value={repo.name}>
                      <Stack direction="row" alignItems="center" spacing={1} width="100%">
                        <RepoIcon fontSize="small" color="secondary" />
                        <Box>
                          <Typography variant="body1">{repo.name}</Typography>
                          {repo.description && (
                            <Typography variant="caption" color="text.secondary">
                              {repo.description}
                            </Typography>
                          )}
                        </Box>
                        <Chip 
                          label={repo.isPrivate ? "Private" : "Public"}
                          size="small" 
                          color={repo.isPrivate ? "default" : "success"}
                          variant="outlined"
                          sx={{ ml: 'auto' }}
                        />
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Selection Summary */}
              {appName.trim() && selectedOrg && selectedRepo && (
                <Box 
                    sx={{
                    p: 2, 
                    bgcolor: "primary.50", 
                    borderRadius: 1,
                    border: 1,
                    borderColor: "primary.200"
                  }}
                >
                  <Typography variant="body2" color="primary" fontWeight={600} gutterBottom>
                    Ready for Adoption:
                  </Typography>
                    <Stack spacing={1}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <AppIcon fontSize="small" color="primary" />
                      <Typography variant="body1" fontWeight={600}>{appName}</Typography>
                      </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <OrgIcon fontSize="small" color="primary" />
                      <Typography variant="body1" fontWeight={600}>{selectedOrg}</Typography>
                      <Typography variant="body2" color="text.secondary">/</Typography>
                      <RepoIcon fontSize="small" color="secondary" />
                      <Typography variant="body1" fontWeight={600}>{selectedRepo}</Typography>
                        </Stack>
                    {appDescription.trim() && (
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 4, fontStyle: 'italic' }}>
                        &ldquo;{appDescription}&rdquo;
                      </Typography>
                    )}
                    </Stack>
                </Box>
              )}

              {/* Empty State */}
              {!loading && orgsWithRepos.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary">
                    No organizations found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                    No repositories are available for adoption
              </Typography>
            </Box>
              )}
            </Stack>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: 1, borderColor: "divider" }}>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <AdoptApplicationButton
          onClick={handleAdopt}
          disabled={!canAdopt}
          loading={loading}
        />
      </DialogActions>
    </Dialog>
  );
}
