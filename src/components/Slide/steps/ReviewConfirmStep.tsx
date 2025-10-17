"use client";

import * as React from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  Domain as DomainIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

interface EnvironmentMapping {
  environmentId: string;
  environmentName: string;
  amplifyBranch: string;
  subdomainPrefix: string;
  error?: string;
}

interface ReviewConfirmStepProps {
  selectedDomain: string;
  certificateType: 'amplify' | 'custom';
  certificateArn: string;
  environmentMappings: EnvironmentMapping[];
  enablePreviewSubdomains: boolean;
  previewPattern: string;
}

export default function ReviewConfirmStep({
  selectedDomain,
  certificateType,
  certificateArn,
  environmentMappings,
  enablePreviewSubdomains,
  previewPattern,
}: ReviewConfirmStepProps) {
  return (
    <Stack spacing={3}>
      <Typography variant="subtitle1" fontWeight={600}>
        Review Your Configuration
      </Typography>

      {/* Domain Info */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Domain
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            <DomainIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              {selectedDomain}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* SSL Certificate */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            SSL Certificate
          </Typography>
          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <CheckCircleIcon fontSize="small" color="success" />
              <Typography variant="body2" fontWeight={600}>
                {certificateType === 'amplify' ? 'Amplify-Managed Certificate' : 'Custom Certificate'}
              </Typography>
            </Stack>
            {certificateType === 'custom' && certificateArn && (
              <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', pl: 3 }}>
                {certificateArn}
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Environment Mappings */}
      <Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Subdomain Mappings ({environmentMappings.length})
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Environment</TableCell>
                <TableCell>Subdomain</TableCell>
                <TableCell>Branch</TableCell>
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
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {mapping.subdomainPrefix}.{selectedDomain}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={mapping.amplifyBranch} size="small" variant="outlined" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Preview Subdomains */}
      {enablePreviewSubdomains && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Preview Subdomains
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <CheckCircleIcon fontSize="small" color="success" />
              <Typography variant="body2">
                Enabled with pattern: <strong>{previewPattern}</strong>
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Next Steps Info */}
      <Alert severity="info">
        <Typography variant="body2" fontWeight={600} gutterBottom>
          What happens next?
        </Typography>
        <Stack component="ul" spacing={0.5} sx={{ m: 0, pl: 2 }}>
          <li>
            <Typography variant="caption">
              Domain will be associated with AWS Amplify
            </Typography>
          </li>
          <li>
            <Typography variant="caption">
              You&apos;ll need to configure DNS records
            </Typography>
          </li>
          <li>
            <Typography variant="caption">
              Domain verification (typically 5-30 minutes)
            </Typography>
          </li>
          <li>
            <Typography variant="caption">
              Your custom domain will be active!
            </Typography>
          </li>
        </Stack>
      </Alert>
    </Stack>
  );
}
