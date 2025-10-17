"use client";

import * as React from "react";
import {
  Alert,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

interface EnvironmentMapping {
  environmentId: string;
  environmentName: string;
  amplifyBranch: string;
  subdomainPrefix: string;
  error?: string;
}

interface MapEnvironmentsStepProps {
  environmentMappings: EnvironmentMapping[];
  onEnvironmentMappingChange: (
    environmentId: string,
    field: 'amplifyBranch' | 'subdomainPrefix',
    value: string
  ) => void;
  branches: string[];
}

export default function MapEnvironmentsStep({
  environmentMappings,
  onEnvironmentMappingChange,
  branches,
}: MapEnvironmentsStepProps) {
  return (
    <Stack spacing={3}>
      <Typography variant="subtitle1" fontWeight={600}>
        Map environments to Amplify branches
      </Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Environment</TableCell>
              <TableCell>Amplify Branch</TableCell>
              <TableCell>Subdomain Prefix</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {environmentMappings.map((mapping) => (
              <TableRow key={mapping.environmentId}>
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {mapping.environmentName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <FormControl fullWidth size="small" error={!!mapping.error}>
                    <Select
                      value={mapping.amplifyBranch}
                      onChange={(e) =>
                        onEnvironmentMappingChange(
                          mapping.environmentId,
                          'amplifyBranch',
                          e.target.value
                        )
                      }
                    >
                      {branches.map((branch) => (
                        <MenuItem key={branch} value={branch}>
                          {branch}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    value={mapping.subdomainPrefix}
                    onChange={(e) =>
                      onEnvironmentMappingChange(
                        mapping.environmentId,
                        'subdomainPrefix',
                        e.target.value
                      )
                    }
                    error={!!mapping.error}
                    helperText={mapping.error}
                    placeholder="e.g., www, dev, staging"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Alert severity="info">
        <Typography variant="body2">
          Subdomain prefixes must be unique and contain only lowercase letters, numbers, and hyphens.
          Each environment must have a unique Amplify branch.
        </Typography>
      </Alert>
    </Stack>
  );
}
