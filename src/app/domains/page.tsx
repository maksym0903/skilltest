"use client";

import * as React from "react";
import {
  Stack, Typography, Box, Alert, CircularProgress, Snackbar
} from "@mui/material";
import DomainsTable from "@/components/Table/DomainsTable";
import DomainsService from "@/services/domains";
import type { Domain } from "@/services/types";

// Use Domain type directly from API response
type DomainData = Domain;

export default function DomainsPage() {
  const [domains, setDomains] = React.useState<DomainData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [domainCreatedSuccess, setDomainCreatedSuccess] = React.useState(false);
  const [createdDomainName, setCreatedDomainName] = React.useState<string>("");

  // Fetch domains from API
  const fetchDomains = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching domains...');
      const response = await DomainsService.getDomains();
      console.log('Domains API response:', response);
      
      if (response.success) {
        console.log('Domains data:', response.data);
        console.log('Domains count:', response.data.length);
        console.log('Sample domain:', response.data[0]);
        setDomains(response.data);
      } else {
        console.error('API returned success: false');
        setError('Failed to fetch domains');
      }
    } catch (err) {
      console.error('Error fetching domains:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch domains');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch domains on component mount
  React.useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  // Show loading state
  if (loading) {
    return (
      <Stack spacing={3} alignItems="center" sx={{ py: 4 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading domains...
        </Typography>
      </Stack>
    );
  }

  // Show error state
  if (error) {
    return (
      <Stack spacing={3}>
        <Typography variant="h4" fontWeight={700}>
          Domain Management
        </Typography>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <button onClick={fetchDomains}>
            Retry
          </button>
        </Box>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={700}>
        Domain Management
      </Typography>

      {/* Data Table */}
      <DomainsTable
        rows={domains}
      />

      {/* Success Snackbar for Domain Creation */}
      <Snackbar
        open={domainCreatedSuccess}
        autoHideDuration={6000}
        onClose={() => setDomainCreatedSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setDomainCreatedSuccess(false)} 
          severity="success" 
          sx={{ width: '100%' }}
          variant="filled"
        >
          Domain &ldquo;{createdDomainName}&rdquo; created successfully! 🌐
        </Alert>
      </Snackbar>
    </Stack>
  );
}

