"use client";

import * as React from "react";
import {
  Stack, Typography, Grid, Card, CardContent, Box, Alert, CircularProgress
} from "@mui/material";
import { 
  AccountBalance as AccountIcon, 
  Cloud as CloudIcon, 
  Warning as WarningIcon,
} from "@mui/icons-material";
import AwsAccountTable from "@/components/Table/AwsAccountTable";
import DeleteConfirmationDialog from "@/components/Modal/DeleteConfirmationDialog";
import { AwsAccount } from "@/services/types";
import AwsAccountsService from "@/services/aws-accounts";

// AWS Accounts page using AwsAccountTable component

export default function AWSAccountPage() {
  const [awsAccounts, setAwsAccounts] = React.useState<AwsAccount[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  // Delete dialog state
  const [deleteDialog, setDeleteDialog] = React.useState<{
    open: boolean;
    account: AwsAccount | null;
    isLoading: boolean;
  }>({
    open: false,
    account: null,
    isLoading: false,
  });

  // Fetch AWS accounts from API
  const fetchAwsAccounts = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await AwsAccountsService.getAwsAccounts();
      
      if (response.success && Array.isArray(response.data)) {
        setAwsAccounts(response.data);
      } else {
        setError('Failed to fetch AWS accounts');
      }
    } catch (err) {
      console.error('Error fetching AWS accounts:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAwsAccounts();
  }, [fetchAwsAccounts]);

  // Delete handlers
  const handleDeleteClick = (account: AwsAccount) => {
    console.log('Delete clicked for AWS account:', account);
    setDeleteDialog({
      open: true,
      account,
      isLoading: false,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.account) return;

    setDeleteDialog(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await AwsAccountsService.deleteAwsAccount(deleteDialog.account.id);
      if (response.success) {
        // Remove the deleted account from the state
        setAwsAccounts(prevAccounts => prevAccounts.filter(account => account.id !== deleteDialog.account!.id));
        // Close dialog
        setDeleteDialog({ open: false, account: null, isLoading: false });
        console.log('AWS Account deleted successfully:', response);
      } else {
        alert('Failed to delete AWS account. Please try again.');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete AWS account. Please try again.');
    } finally {
      setDeleteDialog(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, account: null, isLoading: false });
  };

  const activeAccounts = awsAccounts.filter(r => r.status === 'active').length;
  const inactiveAccounts = awsAccounts.filter(r => r.status !== 'active').length;
  const totalAccounts = awsAccounts.length;

  // Show loading state
  if (loading) {
    return (
      <Stack spacing={3} alignItems="center" sx={{ py: 4 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading AWS accounts...
        </Typography>
      </Stack>
    );
  }

  return (
    <>
      <Stack spacing={3}>
        <Typography variant="h4" fontWeight={700}>
          AWS Accounts
        </Typography>

        {/* Error Alert */}
        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        {/* Warning for inactive accounts */}
        {inactiveAccounts > 0 && (
          <Alert severity="warning" icon={<WarningIcon />}>
            {inactiveAccounts} account(s) are currently inactive and may require attention.
          </Alert>
        )}
        
        {/* Stats Cards */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <AccountIcon color="primary" sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      {activeAccounts}
                    </Typography>
                    <Typography color="text.secondary">Active Accounts</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <CloudIcon color="info" sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      {inactiveAccounts}
                    </Typography>
                    <Typography color="text.secondary">Inactive Accounts</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <AccountIcon color="secondary" sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      {totalAccounts}
                    </Typography>
                    <Typography color="text.secondary">Total Accounts</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* AWS Accounts Table Component */}
        <AwsAccountTable 
          rows={awsAccounts} 
          onDeleteClick={handleDeleteClick}
        />
      </Stack>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete AWS Account"
        message="Are you sure you want to delete this AWS account? This action cannot be undone and will permanently remove the account and all its associated data."
        itemName={deleteDialog.account?.name}
        isLoading={deleteDialog.isLoading}
      />
    </>
  );
}
