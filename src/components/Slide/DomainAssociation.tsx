"use client";

import * as React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Drawer,
  IconButton,
  LinearProgress,
  Radio,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Alert,
} from "@mui/material";
import {
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

// Import step components
import ChooseDomainStep from "./steps/ChooseDomainStep";
import MapEnvironmentsStep from "./steps/MapEnvironmentsStep";
import SSLConfigurationStep from "./steps/SSLConfigurationStep";
import ReviewConfirmStep from "./steps/ReviewConfirmStep";
import DNSConfigurationStep from "./steps/DNSConfigurationStep";

interface Environment {
  id: string;
  name: string;
  branch: string;
}

interface EnvironmentMapping {
  environmentId: string;
  environmentName: string;
  amplifyBranch: string;
  subdomainPrefix: string;
  error?: string;
}

interface DNSRecord {
  type: string;
  name: string;
  value: string;
}

interface DomainAssociationProps {
  open: boolean;
  onClose: () => void;
  selectedDomain: string | null;
  selectedAppId: string | null;
  appName: string | null;
  onAssociate?: (config: {
    domain: string;
    appId: string;
    environmentMappings: EnvironmentMapping[];
    certificateType: 'amplify' | 'custom';
    certificateArn?: string;
    enablePreviewSubdomains: boolean;
    previewPattern?: string;
  }) => void;
}

// Mock data
const mockDomains = [
  { name: 'example.com', status: 'available' },
  { name: 'myapp.com', status: 'available' },
  { name: 'company.com', status: 'available' },
  { name: 'business.net', status: 'available' },
];

const mockEnvironments: Environment[] = [
  { id: 'env-1', name: 'production', branch: 'main' },
  { id: 'env-2', name: 'staging', branch: 'staging' },
  { id: 'env-3', name: 'development', branch: 'develop' },
  { id: 'env-4', name: 'qa', branch: 'qa' },
];

const mockBranches = ['main', 'develop', 'staging', 'qa', 'feature/new-ui', 'hotfix/bug-123'];

const mockHostedZones = [
  { id: 'Z1234567890ABC', name: 'example.com', recordCount: 5 },
  { id: 'Z0987654321XYZ', name: 'myapp.com', recordCount: 3 },
  { id: 'Z5555555555DEF', name: 'company.com', recordCount: 8 },
];

const steps = ['Choose Domain', 'Map Environments', 'SSL Configuration', 'Review & Confirm'];

export default function DomainAssociation({
  open,
  onClose,
  selectedDomain: initialDomain,
  selectedAppId,
  appName,
  onAssociate,
}: DomainAssociationProps) {
  // Add CSS animation for spinning refresh icon
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const [activeStep, setActiveStep] = React.useState(0);
  const [selectedDomain, setSelectedDomain] = React.useState<string>(initialDomain || '');
  const [environmentMappings, setEnvironmentMappings] = React.useState<EnvironmentMapping[]>([]);
  const [certificateType, setCertificateType] = React.useState<'amplify' | 'custom'>('amplify');
  const [certificateArn, setCertificateArn] = React.useState('');
  const [enablePreviewSubdomains, setEnablePreviewSubdomains] = React.useState(false);
  const [previewPattern, setPreviewPattern] = React.useState('pr-*');
  
  // Status tracking
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  type AssociationStatus = 'idle' | 'REQUESTING_CERTIFICATE' | 'PENDING_VERIFICATION' | 'PENDING_DEPLOYMENT' | 'UPDATE_COMPLETE' | 'FAILED';
  const [associationStatus, setAssociationStatus] = React.useState<AssociationStatus>('idle');
  const [dnsRecords, setDnsRecords] = React.useState<DNSRecord[]>([]);
  const [mappedUrls, setMappedUrls] = React.useState<{ url: string; status: 'pending' | 'verified' }[]>([]);
  const [showHostedZoneSelector, setShowHostedZoneSelector] = React.useState(false);
  const [selectedHostedZone, setSelectedHostedZone] = React.useState<string>('');
  const [isConfiguringDns, setIsConfiguringDns] = React.useState(false);
  const [dnsConfigured, setDnsConfigured] = React.useState(false);
  const [isPolling, setIsPolling] = React.useState(false);
  const [pollingInterval, setPollingInterval] = React.useState<NodeJS.Timeout | null>(null);
  const [verificationProgress, setVerificationProgress] = React.useState(0);
  const [elapsedTime, setElapsedTime] = React.useState(0);
  const [verificationSteps, setVerificationSteps] = React.useState({
    dnsConfigured: false,
    dnsPropagation: false,
    domainOwnership: false,
    sslCertificate: false,
  });

  // Initialize environment mappings
  React.useEffect(() => {
    if (open && environmentMappings.length === 0) {
      const defaultPrefixes = ['www', 'staging', 'dev', 'qa'];
      const mappings: EnvironmentMapping[] = mockEnvironments.map((env, index) => ({
        environmentId: env.id,
        environmentName: env.name,
        amplifyBranch: env.branch,
        subdomainPrefix: defaultPrefixes[index] || env.name,
      }));
      setEnvironmentMappings(mappings);
    }
  }, [open, environmentMappings.length]);

  // Reset when opening with new domain
  React.useEffect(() => {
    if (open && initialDomain) {
      setSelectedDomain(initialDomain);
      setActiveStep(0);
      setAssociationStatus('idle');
      setDnsRecords([]);
      setMappedUrls([]);
      setShowHostedZoneSelector(false);
      setSelectedHostedZone('');
      setIsConfiguringDns(false);
      setDnsConfigured(false);
      setIsPolling(false);
      setVerificationProgress(0);
      setElapsedTime(0);
      setVerificationSteps({
        dnsConfigured: false,
        dnsPropagation: false,
        domainOwnership: false,
        sslCertificate: false,
      });
    }
  }, [open, initialDomain]);

  // Cleanup polling on unmount
  React.useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleDomainChange = (domain: string) => {
    setSelectedDomain(domain);
  };

  const handleEnvironmentMappingChange = (
    environmentId: string,
    field: 'amplifyBranch' | 'subdomainPrefix',
    value: string
  ) => {
    setEnvironmentMappings((prev) =>
      prev.map((mapping) =>
        mapping.environmentId === environmentId
          ? { ...mapping, [field]: value, error: undefined }
          : mapping
      )
    );
  };

  const validateEnvironmentMappings = (): boolean => {
    const branches = environmentMappings.map((m) => m.amplifyBranch);
    const prefixes = environmentMappings.map((m) => m.subdomainPrefix);
    const prefixRegex = /^[a-z0-9-]+$/;

    let isValid = true;
    const updatedMappings = environmentMappings.map((mapping) => {
      let error: string | undefined;

      // Check for duplicate branches
      if (branches.filter((b) => b === mapping.amplifyBranch).length > 1) {
        error = 'Duplicate branch';
        isValid = false;
      }

      // Check for duplicate prefixes
      if (prefixes.filter((p) => p === mapping.subdomainPrefix).length > 1) {
        error = 'Duplicate prefix';
        isValid = false;
      }

      // Check prefix format
      if (!prefixRegex.test(mapping.subdomainPrefix)) {
        error = 'Invalid format (use a-z, 0-9, -)';
        isValid = false;
      }

      return { ...mapping, error };
    });

    setEnvironmentMappings(updatedMappings);
    return isValid;
  };

  const handleAssociate = async () => {
    setIsSubmitting(true);
    setAssociationStatus('REQUESTING_CERTIFICATE');

    // Mock DNS records
    const mockDNSRecords: DNSRecord[] = environmentMappings.map((mapping) => ({
      type: 'CNAME',
      name: `${mapping.subdomainPrefix}.${selectedDomain}`,
      value: `${mapping.subdomainPrefix}.${selectedDomain}.amplifyapp.com`,
    }));
    mockDNSRecords.push({
      type: 'CNAME',
      name: `_acme-challenge.${selectedDomain}`,
      value: 'validation.acm.amazonaws.com',
    });

    setDnsRecords(mockDNSRecords);
    setMappedUrls(
      environmentMappings.map((mapping) => ({
        url: `https://${mapping.subdomainPrefix}.${selectedDomain}`,
        status: 'pending',
      }))
    );

    // Simulate status progression
    setTimeout(() => setAssociationStatus('PENDING_VERIFICATION'), 2000);
    setTimeout(() => setAssociationStatus('PENDING_DEPLOYMENT'), 4000);
    setTimeout(() => {
      setAssociationStatus('UPDATE_COMPLETE');
      setMappedUrls((prev) => prev.map((url) => ({ ...url, status: 'verified' })));
      setIsSubmitting(false);
    }, 6000);

    if (onAssociate && selectedAppId) {
      onAssociate({
        domain: selectedDomain,
        appId: selectedAppId,
        environmentMappings,
        certificateType,
        certificateArn: certificateType === 'custom' ? certificateArn : undefined,
        enablePreviewSubdomains,
        previewPattern: enablePreviewSubdomains ? previewPattern : undefined,
      });
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleAutoConfigureDns = () => {
    setShowHostedZoneSelector(true);
  };

  const handleHostedZoneSelect = (zoneId: string) => {
    setSelectedHostedZone(zoneId);
  };

  const handleConfigureAutomatically = async () => {
    if (!selectedHostedZone) return;
    
    setIsConfiguringDns(true);
    setShowHostedZoneSelector(false);
    
    // Simulate API call
    setTimeout(() => {
      setIsConfiguringDns(false);
      setDnsConfigured(true);
      setAssociationStatus('PENDING_VERIFICATION');
    }, 2000);
  };

  const handleCheckVerificationStatus = () => {
    startPolling();
  };

  const startPolling = () => {
    setIsPolling(true);
    setElapsedTime(0);
    setVerificationProgress(0);
    setVerificationSteps({
      dnsConfigured: true,
      dnsPropagation: false,
      domainOwnership: false,
      sslCertificate: false,
    });

    // Start elapsed time counter
    setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    // Start verification polling
    const pollInterval = setInterval(() => {
      checkVerificationStatus();
    }, 30000); // Poll every 30 seconds

    setPollingInterval(pollInterval);

    // Auto-stop after 2 hours
    setTimeout(() => {
      stopPolling();
    }, 2 * 60 * 60 * 1000);
  };

  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
    setIsPolling(false);
  };

  const checkVerificationStatus = async () => {
    // Simulate API call to check verification status
    const mockStatuses = ['PENDING_VERIFICATION', 'PENDING_DEPLOYMENT', 'UPDATE_COMPLETE', 'FAILED'];
    const randomStatus = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];
    
    // Simulate progress
    const progress = Math.min(verificationProgress + Math.random() * 20, 100);
    setVerificationProgress(progress);

    // Simulate step completion
    if (progress > 30 && !verificationSteps.dnsPropagation) {
      setVerificationSteps(prev => ({ ...prev, dnsPropagation: true }));
    }
    if (progress > 60 && !verificationSteps.domainOwnership) {
      setVerificationSteps(prev => ({ ...prev, domainOwnership: true }));
    }
    if (progress > 90 && !verificationSteps.sslCertificate) {
      setVerificationSteps(prev => ({ ...prev, sslCertificate: true }));
    }

    if (randomStatus === 'UPDATE_COMPLETE') {
      setAssociationStatus('UPDATE_COMPLETE');
      stopPolling();
      // Generate mock URLs
      const urls = environmentMappings.map(mapping => ({
        url: `https://${mapping.subdomainPrefix}.${selectedDomain}`,
        status: 'verified' as const,
      }));
      setMappedUrls(urls);
    } else if (randomStatus === 'FAILED') {
      setAssociationStatus('FAILED');
      stopPolling();
    } else {
      setAssociationStatus(randomStatus as 'REQUESTING_CERTIFICATE' | 'PENDING_VERIFICATION' | 'PENDING_DEPLOYMENT' | 'UPDATE_COMPLETE' | 'FAILED');
    }
  };

  const handleRefresh = () => {
    console.log('Refreshing domain status...');
  };

  const getStatusColor = (): 'success' | 'error' | 'warning' | 'default' => {
    switch (associationStatus) {
      case 'UPDATE_COMPLETE':
        return 'success';
      case 'FAILED':
        return 'error';
      case 'REQUESTING_CERTIFICATE':
      case 'PENDING_VERIFICATION':
      case 'PENDING_DEPLOYMENT':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = () => {
    switch (associationStatus) {
      case 'UPDATE_COMPLETE':
        return <CheckCircleIcon color="success" />;
      case 'FAILED':
        return <ErrorIcon color="error" />;
      default:
        return <WarningIcon color="warning" />;
    }
  };

  const handleClose = () => {
    // Reset state
    setActiveStep(0);
    setAssociationStatus('idle');
    setDnsRecords([]);
    setMappedUrls([]);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 600, md: 700 },
        },
        zIndex: (theme) => theme.zIndex.modal + 1,
      }}
      ModalProps={{
        keepMounted: false,
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {appName || 'Unknown App'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedDomain || 'Select a domain'}
              </Typography>
            </Box>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
        </Box>

        {/* Content */}
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          {associationStatus === 'idle' ? (
            <>
              {/* Stepper */}
              <Box sx={{ px: 3, pt: 3 }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>

              {/* Step Content */}
              <Box sx={{ p: 3 }}>
                {/* Step 1: Choose Domain */}
                {activeStep === 0 && (
                  <ChooseDomainStep
                    selectedDomain={selectedDomain}
                    onDomainChange={handleDomainChange}
                    domains={mockDomains}
                  />
                )}

                {/* Step 2: Map Environments */}
                {activeStep === 1 && (
                  <MapEnvironmentsStep
                    environmentMappings={environmentMappings}
                    onEnvironmentMappingChange={handleEnvironmentMappingChange}
                    branches={mockBranches}
                  />
                )}

                {/* Step 3: SSL Configuration */}
                {activeStep === 2 && (
                  <SSLConfigurationStep
                    certificateType={certificateType}
                    onCertificateTypeChange={setCertificateType}
                    certificateArn={certificateArn}
                    onCertificateArnChange={setCertificateArn}
                    enablePreviewSubdomains={enablePreviewSubdomains}
                    onPreviewSubdomainsChange={setEnablePreviewSubdomains}
                    previewPattern={previewPattern}
                    onPreviewPatternChange={setPreviewPattern}
                  />
                )}

                {/* Step 4: Review & Confirm */}
                {activeStep === 3 && (
                  <ReviewConfirmStep
                    selectedDomain={selectedDomain}
                    certificateType={certificateType}
                    certificateArn={certificateArn}
                    environmentMappings={environmentMappings}
                    enablePreviewSubdomains={enablePreviewSubdomains}
                    previewPattern={previewPattern}
                  />
                )}
              </Box>
            </>
          ) : (
            // Status View - DNS Configuration Screen
            <Box sx={{ p: 3 }}>
              <Stack spacing={3}>
                {/* Success Banner for UPDATE_COMPLETE */}
                {associationStatus === 'UPDATE_COMPLETE' && (
                  <Alert severity="success" icon={<CheckCircleIcon />}>
                    <Typography variant="body2" fontWeight={600}>
                      Domain successfully associated!
                    </Typography>
                    <Typography variant="caption">
                      Your domain is now live and ready to use.
                    </Typography>
                  </Alert>
                )}

                {/* Status Timeline */}
                {(associationStatus === 'REQUESTING_CERTIFICATE' || associationStatus === 'PENDING_VERIFICATION' || associationStatus === 'PENDING_DEPLOYMENT' || associationStatus === 'UPDATE_COMPLETE' || associationStatus === 'FAILED') && (
                  <Card variant="outlined">
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                        {getStatusIcon()}
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            Status: {associationStatus.replace(/_/g, ' ')}
                          </Typography>
                          <Chip
                            label={associationStatus.replace(/_/g, ' ')}
                            color={getStatusColor()}
                            size="small"
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      </Stack>
                      {isSubmitting && <LinearProgress />}
                    </CardContent>
                  </Card>
                )}

                {/* DNS Configuration Component */}
                <DNSConfigurationStep
                  selectedDomain={selectedDomain}
                  associationStatus={associationStatus}
                  dnsRecords={dnsRecords}
                  isSubmitting={isSubmitting}
                  isConfiguringDns={isConfiguringDns}
                  dnsConfigured={dnsConfigured}
                  onCopyToClipboard={handleCopyToClipboard}
                  onAutoConfigureDns={handleAutoConfigureDns}
                  onCheckVerificationStatus={handleCheckVerificationStatus}
                />

                {/* Verification Status Screen */}
                {isPolling && (
                  <Card variant="outlined">
                    <CardContent>
                      <Stack spacing={3}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <RefreshIcon sx={{ animation: 'spin 2s linear infinite' }} />
                          <Typography variant="h6">
                            🔄 Verifying Domain Configuration
                          </Typography>
                        </Stack>
                        
                        <Divider />
                        
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Domain: {selectedDomain}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Status: {associationStatus.replace(/_/g, ' ')}
                          </Typography>
                        </Box>

                        {/* Progress Bar */}
                        <Box>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                            <Typography variant="body2" fontWeight={600}>
                              Progress
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {Math.round(verificationProgress)}%
                            </Typography>
                          </Stack>
                          <LinearProgress 
                            variant="determinate" 
                            value={verificationProgress}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            Checking domain verification...
                          </Typography>
                        </Box>

                        {/* Verification Steps */}
                        <Box>
                          <Typography variant="body2" fontWeight={600} gutterBottom>
                            What&apos;s happening:
                          </Typography>
                          <Stack spacing={1}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              {verificationSteps.dnsConfigured ? <CheckCircleIcon color="success" fontSize="small" /> : <Box sx={{ width: 20 }} />}
                              <Typography variant="body2" color={verificationSteps.dnsConfigured ? 'success.main' : 'text.secondary'}>
                                ✅ DNS records configured
                              </Typography>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              {verificationSteps.dnsPropagation ? <CheckCircleIcon color="success" fontSize="small" /> : <RefreshIcon fontSize="small" />}
                              <Typography variant="body2" color={verificationSteps.dnsPropagation ? 'success.main' : 'text.secondary'}>
                                {verificationSteps.dnsPropagation ? '✅' : '🔄'} Waiting for DNS propagation
                              </Typography>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              {verificationSteps.domainOwnership ? <CheckCircleIcon color="success" fontSize="small" /> : <Box sx={{ width: 20 }} />}
                              <Typography variant="body2" color={verificationSteps.domainOwnership ? 'success.main' : 'text.secondary'}>
                                {verificationSteps.domainOwnership ? '✅' : '⏳'} Verifying domain ownership
                              </Typography>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              {verificationSteps.sslCertificate ? <CheckCircleIcon color="success" fontSize="small" /> : <Box sx={{ width: 20 }} />}
                              <Typography variant="body2" color={verificationSteps.sslCertificate ? 'success.main' : 'text.secondary'}>
                                {verificationSteps.sslCertificate ? '✅' : '⏳'} Issuing SSL certificate
                              </Typography>
                            </Stack>
                          </Stack>
                        </Box>

                        {/* Time Info */}
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            ⏱️ Elapsed time: {Math.floor(elapsedTime / 60)} minutes
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ℹ️ This typically takes 5-30 minutes
                          </Typography>
                        </Box>

                        {/* Action Buttons */}
                        <Stack direction="row" spacing={2}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => console.log('Check DNS Records')}
                          >
                            Check DNS Records
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => window.open('https://docs.aws.amazon.com/amplify/latest/userguide/custom-domains.html', '_blank')}
                          >
                            Troubleshooting Guide
                          </Button>
                        </Stack>

                        <Button
                          variant="text"
                          size="small"
                          onClick={stopPolling}
                          color="error"
                        >
                          Stop Checking
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                )}

                {/* Success State - Domain Active */}
                {associationStatus === 'UPDATE_COMPLETE' && mappedUrls.length > 0 && (
                  <Card variant="outlined" sx={{ borderColor: 'success.main' }}>
                    <CardContent>
                      <Stack spacing={3}>
                        <Alert severity="success" icon={<CheckCircleIcon />}>
                          <Typography variant="h6" fontWeight={600}>
                            ✅ Domain Configuration Complete!
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            🎉 Your custom domain is now active!
                          </Typography>
                        </Alert>

                        <Box>
                          <Typography variant="body2" fontWeight={600} gutterBottom>
                            Your app is now available at:
                          </Typography>
                          <Stack spacing={1}>
                            {mappedUrls.map((urlItem, index) => (
                              <Card key={index} variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                                <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                      <Typography variant="body2">🌐</Typography>
                                      <Typography variant="body2" fontWeight={600}>
                                        {environmentMappings[index]?.environmentName || 'Environment'}
                                      </Typography>
                                    </Stack>
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                      <Typography variant="body2" fontFamily="monospace" color="text.secondary">
                                        {urlItem.url}
                                      </Typography>
                                      <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => window.open(urlItem.url, '_blank')}
                                      >
                                        Visit →
                                      </Button>
                                    </Stack>
                                  </Stack>
                                </CardContent>
                              </Card>
                            ))}
                          </Stack>
                        </Box>

                        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                          <Chip label="🔒 SSL/HTTPS: Active" color="success" size="small" />
                          <Chip label="📊 Status: AVAILABLE" color="success" size="small" />
                          <Chip label={`⏱️ Verified in: ${Math.floor(elapsedTime / 60)} minutes`} size="small" />
                        </Stack>

                        <Stack direction="row" spacing={2}>
                          <Button
                            variant="contained"
                            onClick={() => {
                              onClose();
                              // Navigate to app dashboard
                            }}
                          >
                            Return to App Dashboard
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => console.log('Manage Domain')}
                          >
                            Manage Domain
                          </Button>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                )}

                {/* Error State - Verification Failed */}
                {associationStatus === 'FAILED' && (
                  <Card variant="outlined" sx={{ borderColor: 'error.main' }}>
                    <CardContent>
                      <Stack spacing={3}>
                        <Alert severity="error" icon={<ErrorIcon />}>
                          <Typography variant="h6" fontWeight={600}>
                            ❌ Domain Verification Failed
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            DNS records could not be verified.
                          </Typography>
                        </Alert>

                        <Box>
                          <Typography variant="body2" fontWeight={600} gutterBottom>
                            Common issues:
                          </Typography>
                          <Stack spacing={0.5}>
                            <Typography variant="body2" color="text.secondary">
                              • DNS records not properly configured
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              • DNS propagation not complete (wait longer)
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              • Incorrect values in DNS records
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              • Typos in record names or values
                            </Typography>
                          </Stack>
                        </Box>

                        <Box>
                          <Typography variant="body2" fontWeight={600} gutterBottom>
                            What to do:
                          </Typography>
                          <Stack spacing={0.5}>
                            <Typography variant="body2" color="text.secondary">
                              1. Double-check your DNS records
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              2. Wait for DNS propagation (up to 48 hours)
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              3. Use online DNS checker tools
                            </Typography>
                          </Stack>
                        </Box>

                        <Stack direction="row" spacing={2} flexWrap="wrap">
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => console.log('View DNS Records')}
                          >
                            View DNS Records
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => window.open('https://dnschecker.org/', '_blank')}
                          >
                            Check DNS Online
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              setAssociationStatus('PENDING_VERIFICATION');
                              startPolling();
                            }}
                          >
                            Retry Verification
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => console.log('Contact Support')}
                          >
                            Contact Support
                          </Button>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                )}
              </Stack>
            </Box>
          )}
        </Box>

        {/* Hosted Zone Selector Modal */}
        {showHostedZoneSelector && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: (theme) => theme.zIndex.modal + 2,
            }}
          >
            <Card sx={{ width: 400, maxWidth: '90vw' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Select Route53 Hosted Zone:
                </Typography>
                <Stack spacing={2} sx={{ mt: 2 }}>
                  {mockHostedZones.map((zone) => (
                    <Card
                      key={zone.id}
                      variant="outlined"
                      sx={{
                        cursor: 'pointer',
                        border: selectedHostedZone === zone.id ? 2 : 1,
                        borderColor: selectedHostedZone === zone.id ? 'primary.main' : 'divider',
                        bgcolor: selectedHostedZone === zone.id ? 'action.selected' : 'background.paper',
                      }}
                      onClick={() => handleHostedZoneSelect(zone.id)}
                    >
                      <CardContent sx={{ py: 2 }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Radio
                            checked={selectedHostedZone === zone.id}
                            onChange={() => handleHostedZoneSelect(zone.id)}
                          />
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {zone.name} ({zone.id})
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {zone.recordCount} existing records
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setShowHostedZoneSelector(false)}
                    fullWidth
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleConfigureAutomatically}
                    disabled={!selectedHostedZone}
                    fullWidth
                  >
                    Configure Automatically
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Footer Actions */}
        <Box sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
          {associationStatus === 'idle' ? (
            <Stack direction="row" spacing={2}>
              {activeStep > 0 && (
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={handleBack}
                >
                  Back
                </Button>
              )}
              <Box sx={{ flexGrow: 1 }} />
              {activeStep < steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={() => {
                    if (activeStep === 1) {
                      if (validateEnvironmentMappings()) {
                        handleNext();
                      }
                    } else {
                      handleNext();
                    }
                  }}
                  disabled={activeStep === 0 && !selectedDomain}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleAssociate}
                  disabled={
                    certificateType === 'custom' && !certificateArn
                  }
                >
                  Associate Domain
                </Button>
              )}
            </Stack>
          ) : (
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                disabled={isSubmitting}
              >
                Refresh
              </Button>
              <Box sx={{ flexGrow: 1 }} />
              <Button variant="contained" onClick={handleClose}>
                Close
              </Button>
            </Stack>
          )}
        </Box>
      </Box>
    </Drawer>
  );
}
