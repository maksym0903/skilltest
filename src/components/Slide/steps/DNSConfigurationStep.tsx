"use client";

import * as React from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  ContentCopy as CopyIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

interface DNSRecord {
  type: string;
  name: string;
  value: string;
}

interface DNSConfigurationStepProps {
  selectedDomain: string;
  associationStatus: string;
  dnsRecords: DNSRecord[];
  isSubmitting: boolean;
  isConfiguringDns: boolean;
  dnsConfigured: boolean;
  onCopyToClipboard: (text: string) => void;
  onAutoConfigureDns: () => void;
  onCheckVerificationStatus: () => void;
}

export default function DNSConfigurationStep({
  selectedDomain,
  associationStatus,
  dnsRecords,
  isSubmitting,
  isConfiguringDns,
  dnsConfigured,
  onCopyToClipboard,
  onAutoConfigureDns,
  onCheckVerificationStatus,
}: DNSConfigurationStepProps) {
  return (
    <Stack spacing={3}>
      {/* Warning Banner for DNS Configuration Needed */}
      {(associationStatus === 'REQUESTING_CERTIFICATE' || associationStatus === 'PENDING_VERIFICATION' || associationStatus === 'PENDING_DEPLOYMENT' || associationStatus === 'FAILED') && (
        <Alert severity="warning" icon={<WarningIcon />}>
          <Typography variant="body2" fontWeight={600}>
            DNS Configuration Required
          </Typography>
          <Typography variant="caption">
            Domain associated successfully! Now configure DNS records.
          </Typography>
        </Alert>
      )}

      {/* Instructions */}
      {dnsRecords.length > 0 && associationStatus !== 'UPDATE_COMPLETE' && (
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Add these records to your DNS provider:
          </Typography>
          <Typography variant="caption" color="text.secondary">
            (GoDaddy, Cloudflare, Route53, Namecheap, etc.)
          </Typography>
        </Box>
      )}

      {/* DNS Records - Routing Records */}
      {dnsRecords.length > 0 && (
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              📋 Routing Records (CNAME)
            </Typography>
          </Stack>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell align="center">Copy</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dnsRecords.filter(record => !record.name.includes('_acme-challenge')).map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Chip label={record.type} size="small" />
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                      {record.name}
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                      {record.value}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Copy to clipboard">
                        <IconButton
                          size="small"
                          onClick={() => onCopyToClipboard(record.value)}
                        >
                          <CopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* SSL Validation Records */}
      {dnsRecords.some(record => record.name.includes('_acme-challenge')) && (
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              🔐 SSL Validation Records (CNAME)
            </Typography>
          </Stack>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell align="center">Copy</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dnsRecords.filter(record => record.name.includes('_acme-challenge')).map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Chip label={record.type} size="small" />
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                      {record.name}
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                      {record.value}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Copy to clipboard">
                        <IconButton
                          size="small"
                          onClick={() => onCopyToClipboard(record.value)}
                        >
                          <CopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Configuration Method Options */}
      {dnsRecords.length > 0 && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Choose configuration method:
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  For Route53 users:
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<CheckCircleIcon />}
                  fullWidth
                  onClick={onAutoConfigureDns}
                >
                  ⚡ Auto-Configure DNS (Instant!)
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Tutorial Link */}
      {dnsRecords.length > 0 && (
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="text"
            size="small"
            onClick={() => {
              window.open('https://docs.aws.amazon.com/amplify/latest/userguide/custom-domains.html', '_blank');
            }}
          >
            📹 Watch Tutorial: How to Add DNS Records
          </Button>
        </Box>
      )}

      {/* DNS Configured Success State */}
      {dnsConfigured && (
        <Alert severity="success" icon={<CheckCircleIcon />}>
          <Typography variant="body2" fontWeight={600}>
            ✅ DNS Configured Automatically!
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Successfully created 6 DNS records in Route53
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
            Verification will begin automatically. This may take 5-30 minutes.
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={onCheckVerificationStatus}
            sx={{ mt: 2 }}
          >
            Check Verification Status →
          </Button>
        </Alert>
      )}

      {/* Loading State for DNS Configuration */}
      {isConfiguringDns && (
        <Alert severity="info" icon={<RefreshIcon />}>
          <Typography variant="body2" fontWeight={600}>
            Creating DNS records...
          </Typography>
          <LinearProgress sx={{ mt: 1 }} />
        </Alert>
      )}
    </Stack>
  );
}
