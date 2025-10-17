"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Stack,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  IconButton,
  Divider,
  SelectChangeEvent,
} from "@mui/material";
import { 
  Domain as DomainIcon, 
  Add as AddIcon, 
  Delete as DeleteIcon 
} from "@mui/icons-material";
import DomainsService from "@/services/domains";

interface DomainEntry {
  domainName: string;
  accountId: string;
}

export default function CreateDomainPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  const [formData, setFormData] = React.useState({
    userId: "",
    domains: [{ domainName: "", accountId: "" }] as DomainEntry[],
    actions: ["read", "write"] as string[],
    types: ["A", "TXT"] as string[],
  });

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleDomainChange = (index: number, field: keyof DomainEntry) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDomains = [...formData.domains];
    newDomains[index][field] = event.target.value;
    setFormData(prev => ({
      ...prev,
      domains: newDomains
    }));
  };

  const addDomainEntry = () => {
    setFormData(prev => ({
      ...prev,
      domains: [...prev.domains, { domainName: "", accountId: "" }]
    }));
  };

  const removeDomainEntry = (index: number) => {
    if (formData.domains.length > 1) {
      const newDomains = formData.domains.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        domains: newDomains
      }));
    }
  };

  const handleMultiSelectChange = (field: 'actions' | 'types') => (event: SelectChangeEvent<string[]>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value as string[]
    }));
  };

  const validateForm = () => {
    if (!formData.userId.trim()) {
      setError("User ID is required");
      return false;
    }

    for (let i = 0; i < formData.domains.length; i++) {
      const domain = formData.domains[i];
      if (!domain.domainName.trim()) {
        setError(`Domain name is required for entry ${i + 1}`);
        return false;
      }
      if (!domain.accountId.trim()) {
        setError(`AWS Account ID is required for entry ${i + 1}`);
        return false;
      }
      if (!/^\d{12}$/.test(domain.accountId.trim())) {
        setError(`AWS Account ID must be 12 digits for entry ${i + 1}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Transform the form data to match the expected API format
      const payload = {
        userId: formData.userId.trim(),
        domains: formData.domains.map(domain => ({
          domainName: domain.domainName.trim(),
          accountId: domain.accountId.trim()
        })),
        actions: formData.actions,
        types: formData.types
      };

      console.log('Submitting domain registration:', payload);
      
      // Use the registerDomains method for the new API endpoint
      const response = await DomainsService.registerDomains(payload);

      if (response.success) {
        // Redirect to domains page with success message
        router.push("/domains?domainCreated=true&domainName=" + encodeURIComponent(formData.domains[0].domainName));
      } else {
        setError(response.message || "Failed to register domains");
      }
    } catch (err) {
      console.error("Error registering domains:", err);
      setError(err instanceof Error ? err.message : "Failed to register domains");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/domains");
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={700}>
        Register Domain
      </Typography>

      <Card sx={{ maxWidth: 800 }}>
        <CardContent>
          <Stack spacing={3}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <DomainIcon color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h6" fontWeight={600}>
                Domain Registration Form
              </Typography>
            </Box>

            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                {/* Required Fields Section */}
                <Box>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Required Fields
                  </Typography>
                  
                  <Stack spacing={3}>
                    <TextField
                      label="User ID"
                      placeholder="user123"
                      value={formData.userId}
                      onChange={handleInputChange("userId")}
                      required
                      fullWidth
                      helperText="Unique identifier for the user registering the domain"
                      disabled={loading}
                    />

                    {/* Domains Section */}
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Domains to Register
                        </Typography>
                        <Button
                          startIcon={<AddIcon />}
                          onClick={addDomainEntry}
                          disabled={loading}
                          size="small"
                        >
                          Add Domain
                        </Button>
                      </Box>
                      
                      <Stack spacing={2}>
                        {formData.domains.map((domain, index) => (
                          <Card key={index} variant="outlined">
                            <CardContent>
                              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" fontWeight={600}>
                                  Domain Entry {index + 1}
                                </Typography>
                                {formData.domains.length > 1 && (
                                  <IconButton
                                    onClick={() => removeDomainEntry(index)}
                                    disabled={loading}
                                    size="small"
                                    color="error"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                )}
                              </Stack>
                              
                              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                <TextField
                                  label="Domain Name"
                                  placeholder="example.com"
                                  value={domain.domainName}
                                  onChange={handleDomainChange(index, "domainName")}
                                  required
                                  fullWidth
                                  helperText="Must be a valid domain format"
                                  disabled={loading}
                                />
                                <TextField
                                  label="AWS Account ID"
                                  placeholder="123456789012"
                                  value={domain.accountId}
                                  onChange={handleDomainChange(index, "accountId")}
                                  required
                                  fullWidth
                                  helperText="Must be 12-digit AWS account ID"
                                  disabled={loading}
                                />
                              </Stack>
                            </CardContent>
                          </Card>
                        ))}
                      </Stack>
                    </Box>
                  </Stack>
                </Box>

                <Divider />

                {/* Optional Fields Section */}
                <Box>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Optional Fields
                  </Typography>
                  
                  <Stack spacing={3}>
                    <FormControl fullWidth>
                      <InputLabel>Allowed Actions</InputLabel>
                      <Select
                        multiple
                        value={formData.actions}
                        onChange={handleMultiSelectChange('actions')}
                        input={<OutlinedInput label="Allowed Actions" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip key={value} label={value} size="small" />
                            ))}
                          </Box>
                        )}
                        disabled={loading}
                      >
                        <MenuItem value="read">read (default)</MenuItem>
                        <MenuItem value="write">write (default)</MenuItem>
                        <MenuItem value="delete">delete</MenuItem>
                        <MenuItem value="manage">manage</MenuItem>
                      </Select>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                        Select the actions allowed for these domains
                      </Typography>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel>DNS Record Types</InputLabel>
                      <Select
                        multiple
                        value={formData.types}
                        onChange={handleMultiSelectChange('types')}
                        input={<OutlinedInput label="DNS Record Types" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip key={value} label={value} size="small" />
                            ))}
                          </Box>
                        )}
                        disabled={loading}
                      >
                        <MenuItem value="A">A (default)</MenuItem>
                        <MenuItem value="TXT">TXT (default)</MenuItem>
                        <MenuItem value="CNAME">CNAME</MenuItem>
                        <MenuItem value="MX">MX</MenuItem>
                        <MenuItem value="NS">NS</MenuItem>
                      </Select>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                        Select the DNS record types to support
                      </Typography>
                    </FormControl>
                  </Stack>
                </Box>

                <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{ minWidth: 140 }}
                  >
                    {loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      "Register Domains"
                    )}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
