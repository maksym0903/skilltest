"use client";

import * as React from "react";
import { Stack, Typography, Alert, CircularProgress, Card, CardContent } from "@mui/material";
import ReposTable from "@/components/Table/ReposTable";
import DeleteConfirmationDialog from "@/components/Modal/DeleteConfirmationDialog";
import ReposService from "@/services/repos";
import { Repository } from "@/services/types";

export default function ReposPage() {
  // Repos data
  const [repos, setRepos] = React.useState<Repository[]>([]);
  const [reposLoading, setReposLoading] = React.useState(false);
  const [reposError, setReposError] = React.useState<string | null>(null);
  
  // Search is now handled by ReposTable component

  // Delete dialog state
  const [deleteDialog, setDeleteDialog] = React.useState<{
    open: boolean;
    repo: Repository | null;
    isLoading: boolean;
  }>({
    open: false,
    repo: null,
    isLoading: false,
  });

  // Action handlers
  const handleViewClick = (repo: Repository) => {
    console.log('View clicked for repository:', repo);
    // Use URL from API response
    if (repo.url) {
      window.open(repo.url, '_blank', 'noopener,noreferrer');
    } else {
      console.error('No URL available for this repository:', repo);
      alert('Repository URL not available');
    }
  };

  const handleEditClick = (repo: Repository) => {
    console.log('Edit clicked for repository:', repo);
    // Add edit functionality here
  };

  const handleDeleteClick = (repo: Repository) => {
    console.log('Delete clicked for repository:', repo);
    setDeleteDialog({
      open: true,
      repo,
      isLoading: false,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.repo) return;

    setDeleteDialog(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await ReposService.deleteRepo(deleteDialog.repo.id);
      if (response.success) {
        // Remove the deleted repo from the state
        setRepos(prevRepos => prevRepos.filter(repo => repo.id !== deleteDialog.repo!.id));
        // Close dialog
        setDeleteDialog({ open: false, repo: null, isLoading: false });
        console.log('Repository deleted successfully:', response);
      } else {
        alert('Failed to delete repository. Please try again.');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete repository. Please try again.');
    } finally {
      setDeleteDialog(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, repo: null, isLoading: false });
  };

  // Fetch repos on component mount
  const fetchRepos = React.useCallback(async () => {
    try {
      setReposLoading(true);
      setReposError(null);
      const response = await ReposService.getRepos();
      
      if (response.success) {
        setRepos(response.data);
      } else {
        setReposError('Failed to fetch repositories');
      }
    } catch (error) {
      console.error('Error fetching repos:', error);
      setReposError(error instanceof Error ? error.message : 'Failed to fetch repositories');
    } finally {
      setReposLoading(false);
    }
  }, []);

  // Fetch repos on mount
  React.useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  return (
    <>
      <Card>
        <CardContent>
          {/* Show loading state for repos */}
          {reposLoading && (
            <Stack direction="row" alignItems="center" spacing={2} sx={{ py: 4 }}>
              <CircularProgress size={24} />
              <Typography variant="body1" color="text.secondary">
                Loading repositories...
              </Typography>
            </Stack>
          )}

          {/* Show error state for repos */}
          {reposError && !reposLoading && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {reposError}
            </Alert>
          )}

          {/* Show repos table */}
          {!reposLoading && !reposError && (
            <ReposTable 
              rows={repos} 
              onViewClick={handleViewClick}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
            />
          )}
        </CardContent>
      </Card>

     {/* Delete Confirmation Dialog */}
     <DeleteConfirmationDialog
       open={deleteDialog.open}
       onClose={handleDeleteCancel}
       onConfirm={handleDeleteConfirm}
       title="Delete Repository"
       message="Are you sure you want to delete this repository? This action cannot be undone and will permanently remove the repository and all its associated data."
       itemName={deleteDialog.repo?.alias || deleteDialog.repo?.name}
       isLoading={deleteDialog.isLoading}
     />
   </>
 );
}

