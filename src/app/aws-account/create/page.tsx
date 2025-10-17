"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  Stack,
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Breadcrumbs,
  Link,
  CircularProgress,
} from "@mui/material";
import {
  AccountBalance as AccountIcon,
  Cloud as CloudIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import AwsAccountsService from "@/services/aws-accounts";

interface AwsAccountFormData {
  accountName: string;
  accountId: string;
  region: string;
  registrationMethod: string;
  accessKeyId: string;
  secretAccessKey: string;
  permissionLevel: string;
}

const AWS_REGIONS = [
  { value: "us-east-1", label: "US East (N. Virginia)" },
  { value: "us-east-2", label: "US East (Ohio)" },
  { value: "us-west-1", label: "US West (N. California)" },
  { value: "us-west-2", label: "US West (Oregon)" },
  { value: "eu-west-1", label: "Europe (Ireland)" },
  { value: "eu-west-2", label: "Europe (London)" },
  { value: "eu-west-3", label: "Europe (Paris)" },
  { value: "eu-central-1", label: "Europe (Frankfurt)" },
  { value: "ap-southeast-1", label: "Asia Pacific (Singapore)" },
  { value: "ap-southeast-2", label: "Asia Pacific (Sydney)" },
  { value: "ap-northeast-1", label: "Asia Pacific (Tokyo)" },
  { value: "ap-south-1", label: "Asia Pacific (Mumbai)" },
  { value: "ca-central-1", label: "Canada (Central)" },
  { value: "sa-east-1", label: "South America (São Paulo)" },
];

const PERMISSION_LEVELS = [
  { value: "admin", label: "Admin" },
  { value: "read-only", label: "Read Only" },
  { value: "limited", label: "Limited" },
  { value: "unknown", label: "Unknown" },
];

const REGISTRATION_METHODS = [
  { value: "access-key", label: "Access Key" },
  { value: "sso", label: "SSO" },
];

export default function CreateAwsAccountPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AwsAccountFormData>({
    defaultValues: {
      accountName: "",
      accountId: "",
      region: "us-east-1",
      registrationMethod: "access-key",
      accessKeyId: "",
      secretAccessKey: "",
      permissionLevel: "read-only",
    },
  });


  const onSubmit = async (data: AwsAccountFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare the request body according to the API specification
      const requestBody = {
        name: data.accountName,
        accountId: data.accountId,
        region: data.region,
        registrationMethod: data.registrationMethod,
        accessKeyId: data.accessKeyId,
        secretAccessKey: data.secretAccessKey,
        permissions: {
          level: data.permissionLevel
        }
      };

      console.log("Creating AWS account with data:", requestBody);

      // Make API call to create AWS account using the service
      const result = await AwsAccountsService.createAwsAccount(requestBody);
      console.log("AWS account created successfully:", result);
      
      // Redirect to AWS accounts list on success
      router.push("/aws-account");
    } catch (error) {
      console.error("Error creating AWS account:", error);
      setSubmitError(error instanceof Error ? error.message : "Failed to create AWS account");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/aws-account");
  };

  return (
    <Stack spacing={3}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          color="inherit"
          href="/aws-account"
          sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
        >
          AWS Accounts
        </Link>
        <Typography color="text.primary">Create New Account</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2}>
        <AccountIcon sx={{ fontSize: 32, color: "primary.main" }} />
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Create New AWS Account
          </Typography>
          <Typography color="text.secondary">
            Add a new AWS account to manage your cloud resources
          </Typography>
        </Box>
      </Stack>

      {/* Info Alert */}
      <Alert severity="info" icon={<InfoIcon />}>
        <Typography variant="body2">
          <strong>Security Note:</strong> Your AWS credentials will be encrypted and stored securely. 
          Make sure you have the necessary permissions to access the AWS services you plan to use.
        </Typography>
      </Alert>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                      Basic Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Provide basic details about your AWS account
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="accountName"
                        control={control}
                        rules={{ required: "Account name is required" }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Account Name"
                            fullWidth
                            error={!!errors.accountName}
                            helperText={errors.accountName?.message}
                            placeholder="e.g., Production Account"
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="accountId"
                        control={control}
                        rules={{
                          required: "AWS Account ID is required",
                          pattern: {
                            value: /^\d{12}$/,
                            message: "AWS Account ID must be exactly 12 digits",
                          },
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="AWS Account ID"
                            fullWidth
                            error={!!errors.accountId}
                            helperText={errors.accountId?.message || "12-digit AWS account ID"}
                            placeholder="123456789012"
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* AWS Configuration */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Stack spacing={3}>
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <CloudIcon color="primary" />
                      <Typography variant="h6" fontWeight={600}>
                        AWS Configuration
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      Configure AWS access and region settings
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="region"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <InputLabel id="region-label">Region</InputLabel>
                            <Select
                              {...field}
                              labelId="region-label"
                              id="region-select"
                              label="Region"
                              error={!!errors.region}
                              value={field.value || ""}
                            >
                              {AWS_REGIONS.map((region) => (
                                <MenuItem key={region.value} value={region.value}>
                                  {region.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="registrationMethod"
                        control={control}
                        rules={{ required: "Registration Method is required" }}
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <InputLabel id="registration-method-label">Registration Method</InputLabel>
                            <Select
                              {...field}
                              labelId="registration-method-label"
                              id="registration-method-select"
                              label="Registration Method"
                              error={!!errors.registrationMethod}
                              value={field.value || ""}
                            >
                              {REGISTRATION_METHODS.map((method) => (
                                <MenuItem key={method.value} value={method.value}>
                                  {method.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="accessKeyId"
                        control={control}
                        rules={{ required: "Access Key ID is required" }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Access Key ID"
                            fullWidth
                            error={!!errors.accessKeyId}
                            helperText={errors.accessKeyId?.message}
                            placeholder="AKIA..."
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="permissionLevel"
                        control={control}
                        rules={{ required: "Permission Level is required" }}
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <InputLabel id="permission-level-label">Permission Level</InputLabel>
                            <Select
                              {...field}
                              labelId="permission-level-label"
                              id="permission-level-select"
                              label="Permission Level"
                              error={!!errors.permissionLevel}
                              value={field.value || ""}
                            >
                              {PERMISSION_LEVELS.map((level) => (
                                <MenuItem key={level.value} value={level.value}>
                                  {level.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="secretAccessKey"
                        control={control}
                        rules={{ required: "Secret Access Key is required" }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Secret Access Key"
                            fullWidth
                            type="password"
                            error={!!errors.secretAccessKey}
                            helperText={errors.secretAccessKey?.message}
                            placeholder="Enter your AWS secret access key"
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </CardContent>
            </Card>
          </Grid>


          {/* Error Alert */}
          {submitError && (
            <Grid size={{ xs: 12 }}>
              <Alert severity="error">
                {submitError}
              </Alert>
            </Grid>
          )}

          {/* Action Buttons */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  justifyContent="flex-end"
                >
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    sx={{ minWidth: 120 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={isSubmitting}
                    sx={{ minWidth: 160 }}
                  >
                    {isSubmitting ? "Creating..." : "Create AWS Account"}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Stack>
  );
}
