"use client";

import * as React from "react";
import {
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

interface SSLConfigurationStepProps {
  certificateType: 'amplify' | 'custom';
  onCertificateTypeChange: (type: 'amplify' | 'custom') => void;
  certificateArn: string;
  onCertificateArnChange: (arn: string) => void;
  enablePreviewSubdomains: boolean;
  onPreviewSubdomainsChange: (enabled: boolean) => void;
  previewPattern: string;
  onPreviewPatternChange: (pattern: string) => void;
}

export default function SSLConfigurationStep({
  certificateType,
  onCertificateTypeChange,
  certificateArn,
  onCertificateArnChange,
  enablePreviewSubdomains,
  onPreviewSubdomainsChange,
  previewPattern,
  onPreviewPatternChange,
}: SSLConfigurationStepProps) {
  return (
    <Stack spacing={3}>
      <Typography variant="subtitle1" fontWeight={600}>
        SSL Certificate Configuration
      </Typography>
      
      <FormControl component="fieldset">
        <RadioGroup
          value={certificateType}
          onChange={(e) => onCertificateTypeChange(e.target.value as 'amplify' | 'custom')}
        >
          <FormControlLabel
            value="amplify"
            control={<Radio />}
            label={
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  Amplify-managed certificate (recommended)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  AWS will automatically provision and manage SSL certificate
                </Typography>
              </Box>
            }
          />
          <FormControlLabel
            value="custom"
            control={<Radio />}
            label={
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  Bring your own certificate
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Use an existing ACM certificate
                </Typography>
              </Box>
            }
          />
        </RadioGroup>
      </FormControl>

      {certificateType === 'custom' && (
        <TextField
          fullWidth
          label="ACM Certificate ARN"
          placeholder="arn:aws:acm:region:account:certificate/..."
          value={certificateArn}
          onChange={(e) => onCertificateArnChange(e.target.value)}
          helperText="Enter the ARN of your ACM certificate"
        />
      )}

      <Divider />

      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            Preview Subdomains
          </Typography>
          <ToggleButtonGroup
            value={enablePreviewSubdomains}
            exclusive
            onChange={(e, value) => value !== null && onPreviewSubdomainsChange(value)}
            size="small"
          >
            <ToggleButton value={false}>Disabled</ToggleButton>
            <ToggleButton value={true}>Enabled</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
        
        {enablePreviewSubdomains && (
          <TextField
            fullWidth
            label="Preview Pattern"
            placeholder="pr-*"
            value={previewPattern}
            onChange={(e) => onPreviewPatternChange(e.target.value)}
            helperText="Pattern for preview branch subdomains (e.g., pr-*, feature-*)"
          />
        )}
      </Box>
    </Stack>
  );
}
