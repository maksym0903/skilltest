"use client";

import * as React from "react";
import {
  Card, CardContent, Stack, TextField, Button, Typography, Box, Alert, FormControl, InputLabel, Select, MenuItem, CircularProgress, SelectChangeEvent
} from "@mui/material";
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import AwsAccountsService from "@/services/aws-accounts";
import { environmentsService } from "@/services/environments";
import AppsService from "@/services/apps";
import { AwsAccount } from "@/services/types";

export default function CreateEnvironmentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [formData, setFormData] = React.useState({
    appId: "",
    name: "dev", // Set development as default
    awsAccount: "",
    branch: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  // AWS Accounts state
  const [awsAccounts, setAwsAccounts] = React.useState<AwsAccount[]>([]);
  const [awsAccountsLoading, setAwsAccountsLoading] = React.useState(true);
  const [awsAccountsError, setAwsAccountsError] = React.useState<string | null>(null);

  // Initialize form data with query parameters
  React.useEffect(() => {
    const appIdFromQuery = searchParams.get("appId");
    if (appIdFromQuery) {
      setFormData(prev => ({
        ...prev,
        appId: appIdFromQuery,
      }));
    }
  }, [searchParams]);

  // Fetch AWS accounts on component mount
  React.useEffect(() => {
    const fetchAwsAccounts = async () => {
      try {
        setAwsAccountsLoading(true);
        setAwsAccountsError(null);
        const response = await AwsAccountsService.getAwsAccounts();
        
        if (response.success && Array.isArray(response.data)) {
          setAwsAccounts(response.data);
          // Set the first AWS account as default if available
          if (response.data.length > 0) {
            setFormData(prev => ({
              ...prev,
              awsAccount: response.data[0].id
            }));
          }
        } else {
          setAwsAccountsError('Failed to fetch AWS accounts');
        }
      } catch (error) {
        console.error('Error fetching AWS accounts:', error);
        setAwsAccountsError(error instanceof Error ? error.message : 'Failed to fetch AWS accounts');
      } finally {
        setAwsAccountsLoading(false);
      }
    };

    fetchAwsAccounts();
  }, []);

  const handleTextFieldChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSelectChange = (field: string) => (event: SelectChangeEvent<string>) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Find the selected AWS account to get its 12-digit accountId
      const selectedAwsAccount = awsAccounts.find(
        (account) => account.id === formData.awsAccount
      );

      if (!selectedAwsAccount) {
        throw new Error("Selected AWS account not found.");
      }

      // Prepare request body according to API specification
      const requestBody = {
        app_id: formData.appId,
        name: formData.name,
        aws_account_id: selectedAwsAccount.accountId, // Use the 12-digit accountId
        branch: formData.branch,
        auto_redeploy: true, // Default to true
      };

      console.log("Creating environment with data:", requestBody);
      
      // Step 1: Create the environment
      const response = await environmentsService.createEnvironment(requestBody);
      console.log("Environment created successfully:", response);
      
      if (response.success) {
        // Step 2: If coming from app detail page, link the environment to the app
        const returnTo = searchParams.get("returnTo");
        if (returnTo === "appDetail" && formData.appId && response.data.id) {
          console.log("Linking environment to app:", formData.appId, "->", response.data.id);
          
          try {
            const updateResponse = await AppsService.updateApp(formData.appId, {
              env_id: response.data.id
            });
            console.log("App updated with environment link:", updateResponse);
          } catch (updateError) {
            console.error("Failed to link environment to app:", updateError);
            // Continue with the flow even if linking fails
            // User can still see the env was created via URL params
          }
        }
        
        setSuccess(true);
        setIsSubmitting(false);

        // Redirect based on where user came from
        let redirectPath = "/environment";
        
        if (returnTo === "apps") {
          redirectPath = "/apps";
        } else if (returnTo === "appDetail") {
          redirectPath = `/apps/${formData.appId}`;
        }
        
        // If redirecting to apps page or app detail, include environment info in URL
        if (returnTo === "apps" || returnTo === "appDetail") {
          const envInfo = {
            appId: formData.appId,
            envId: response.data.id,
            envName: response.data.name,
            envStatus: response.data.status
          };
          
          const queryParams = new URLSearchParams({
            envCreated: 'true',
            appId: envInfo.appId,
            envId: envInfo.envId,
            envName: envInfo.envName,
            envStatus: envInfo.envStatus
          });
          
          setTimeout(() => {
            router.push(`${redirectPath}?${queryParams.toString()}`);
          }, 1500);
        } else {
          setTimeout(() => {
            router.push(redirectPath);
          }, 1500);
        }
      } else {
        throw new Error(response.message || "Failed to create environment");
      }
    } catch (error) {
      console.error('Error creating environment:', error);
      setError('Failed to create environment. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          component={Link}
          href={
            searchParams.get("returnTo") === "apps" 
              ? "/apps" 
              : searchParams.get("returnTo") === "appDetail"
              ? `/apps/${searchParams.get("appId")}`
              : "/environment"
          }
          startIcon={<ArrowBackIcon />}
          variant="outlined"
        >
          {searchParams.get("returnTo") === "apps" 
            ? "Back to Apps" 
            : searchParams.get("returnTo") === "appDetail"
            ? "Back to App Detail"
            : "Back to Environments"}
        </Button>
        <Typography variant="h4" fontWeight={700}>
          Create New Environment
        </Typography>
      </Box>

      {success && (
        <Alert severity="success">
          Environment created successfully! Redirecting...
        </Alert>
      )}

      {awsAccountsError && (
        <Alert severity="error">
          {awsAccountsError}
        </Alert>
      )}

      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="App ID"
                value={formData.appId}
                onChange={handleTextFieldChange("appId")}
                placeholder="Enter application ID"
                required
                disabled={!!searchParams.get("appId")}
                helperText={searchParams.get("appId") ? "App ID automatically filled from selected app" : "Enter the ID of the application this environment belongs to"}
              />

              <FormControl fullWidth required>
                <InputLabel>Environment Name</InputLabel>
                <Select
                  value={formData.name}
                  onChange={handleSelectChange("name")}
                  label="Environment Name"
                >
                  <MenuItem value="dev">Development</MenuItem>
                  <MenuItem value="qa">QA</MenuItem>
                  <MenuItem value="prod">Production</MenuItem>
                  <MenuItem value="staging">Staging</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth required>
                <InputLabel>AWS Account</InputLabel>
                <Select
                  value={formData.awsAccount}
                  onChange={handleSelectChange("awsAccount")}
                  label="AWS Account"
                  disabled={awsAccountsLoading}
                >
                  {awsAccountsLoading ? (
                    <MenuItem disabled>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CircularProgress size={16} />
                        <Typography variant="body2">Loading AWS accounts...</Typography>
                      </Box>
                    </MenuItem>
                  ) : awsAccountsError ? (
                    <MenuItem disabled>
                      <Typography variant="body2" color="error">
                        Error loading AWS accounts
                      </Typography>
                    </MenuItem>
                  ) : awsAccounts.length === 0 ? (
                    <MenuItem disabled>
                      <Typography variant="body2" color="text.secondary">
                        No AWS accounts available
                      </Typography>
                    </MenuItem>
                  ) : (
                    awsAccounts.map((account) => (
                      <MenuItem key={account.id} value={account.id}>
                        {account.name} ({account.accountId})
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Branch"
                value={formData.branch}
                onChange={handleTextFieldChange("branch")}
                placeholder="main"
                required
                helperText="Enter the Git branch to deploy from"
              />

              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  component={Link}
                  href={
                    searchParams.get("returnTo") === "apps" 
                      ? "/apps" 
                      : searchParams.get("returnTo") === "appDetail"
                      ? `/apps/${searchParams.get("appId")}`
                      : "/environment"
                  }
                  variant="outlined"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={isSubmitting || !formData.appId.trim() || !formData.name.trim() || !formData.awsAccount.trim() || !formData.branch.trim()}
                >
                  {isSubmitting ? "Creating..." : "Create Environment"}
                </Button>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Stack>
  );
}
